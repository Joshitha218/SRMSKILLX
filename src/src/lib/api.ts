import { supabase } from './supabase';
import { UserProfile, Skill, Goal, Badge } from './types';

// Helper to check if email is valid
export const validateSRMEmail = (email: string) => {
  return email.endsWith('@srmap.edu.in');
};

// Helper to sync user if missing (fixes foreign key errors)
const ensureUserExists = async (userId: string) => {
    // Check if user exists in public table
    const { data } = await supabase.from('users').select('id').eq('id', userId).single();
    if (data) return true;

    // If not, fetch from Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) return false;

    // Insert into public table
    const { error } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'Student',
        year: user.user_metadata?.year || '1st',
        created_at: new Date().toISOString()
    });

    return !error;
};

// --- Auth ---
export const registerUser = async (email: string, password: string, name: string, year: string) => {
  if (!validateSRMEmail(email)) {
    return { error: { message: 'Only @srmap.edu.in emails are allowed.' } };
  }

  // 1. Try Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        year,
      },
    },
  });

  if (error) {
     return { error: { message: error.message } };
  }

  // 2. Insert into 'users' table - OPTIONAL/BEST EFFORT
  // We now rely on the Database Trigger for this. 
  // However, we still try it for backward compatibility or if triggers aren't set up.
  // We ignore RLS errors (42501) because the trigger handles it.
  if (data.user) {
      const { error: dbError } = await supabase.from('users').upsert({
          id: data.user.id,
          email: email,
          name: name,
          year: year,
          created_at: new Date().toISOString()
      });
      
      if (dbError) {
          if (dbError.code === 'PGRST205') {
              return { data, error: { message: 'Database setup required', code: 'SETUP_REQUIRED' } };
          }
          // Ignore RLS error 42501, as it's expected during signup if email confirmation is required.
          // The trigger (if set up) will handle it, or ensureUserExists will handle it on first login.
          if (dbError.code !== '42501') {
             console.error("Failed to sync user:", dbError);
          }
      }
  }

  return { data, error: null };
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const logoutUser = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// --- Skills & Profile Management ---

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    // Fetch basic user info
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    // If there's an error (including missing tables), try the fallback
    if (userError) {
        // If tables are missing, we log a warning but continue to fallback
        if (userError.code === 'PGRST205') {
            // console.warn("Database tables missing. Using auth fallback.");
        } else if (userError.code !== 'PGRST116') { // PGRST116 is "Row not found" (0 rows), which is expected for new users
             console.error("Error fetching user profile:", userError);
        }
        
        // Fallback to Auth metadata if table row missing or table missing
        const currentUser = await getCurrentUser();
        // Only return fallback if the requested userId matches the current user
        if (currentUser && currentUser.id === userId) {
             return {
                 id: currentUser.id,
                 name: currentUser.user_metadata.name || 'Student',
                 email: currentUser.email || '',
                 year: currentUser.user_metadata.year || '1st',
                 skills: [],
                 goals: [],
                 badges: []
             };
        }
        return null;
    }

    // Fetch related data (safely)
    let skills = [], goals = [], badges = [];
    
    // We try/catch these independent fetches so one failure doesn't break the whole profile
    try { const r = await supabase.from('skills').select('*').eq('user_id', userId); skills = r.data || []; } catch(e) {}
    try { const r = await supabase.from('goals').select('*').eq('user_id', userId); goals = r.data || []; } catch(e) {}
    try { const r = await supabase.from('badges').select('*').eq('user_id', userId); badges = r.data || []; } catch(e) {}

    return {
        ...user,
        skills,
        goals,
        badges
    };
};

export const addSkill = async (userId: string, skillName: string) => {
    // Ensure user exists in public table before adding skill
    await ensureUserExists(userId);

    // 1. Check if skill already exists for user
    const { data: existing, error: checkError } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_name', skillName)
        .single();
    
    if (checkError && checkError.code === 'PGRST205') {
        return { error: 'SETUP_REQUIRED' };
    }

    if (existing) return { error: 'Skill already exists' };

    // 2. Insert
    const { data, error } = await supabase
        .from('skills')
        .insert([{ user_id: userId, skill_name: skillName }])
        .select()
        .single();
    
    return { data, error };
};

// --- Search ---

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  if (!query) return [];

  // Safely attempt search
  try {
      const { data: skillMatches, error: skillError } = await supabase
        .from('skills')
        .select('user_id')
        .ilike('skill_name', `%${query}%`);
      
      if (skillError && skillError.code === 'PGRST205') return [];

      const { data: nameMatches } = await supabase
        .from('users')
        .select('id')
        .ilike('name', `%${query}%`);

      const userIds = new Set<string>();
      skillMatches?.forEach(m => userIds.add(m.user_id));
      nameMatches?.forEach(m => userIds.add(m.id));

      if (userIds.size === 0) return [];

      const profiles: UserProfile[] = [];
      for (const id of userIds) {
          const profile = await getUserProfile(id);
          if (profile) profiles.push(profile);
      }

      return profiles;
  } catch (e) {
      return [];
  }
};

// --- Chat ---

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    // Ensure sender exists (receiver might not if they were found via search, but usually they should)
    await ensureUserExists(senderId);

    const { data, error } = await supabase
        .from('messages')
        .insert([{ 
            sender_id: senderId, 
            receiver_id: receiverId, 
            content: content,
            read: false
        }])
        .select()
        .single();
    
    if (error && error.code === 'PGRST205') {
        return { error: 'SETUP_REQUIRED', data: null };
    }

    return { data, error };
};

export const getMessages = async (userId1: string, userId2: string) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId1},receiver_id.eq.${userId1}`)
        .order('created_at', { ascending: true });
    
    if (error) return [];

    if (data) {
        return data.filter(m => 
            (m.sender_id === userId1 && m.receiver_id === userId2) ||
            (m.sender_id === userId2 && m.receiver_id === userId1)
        );
    }
    return [];
};
