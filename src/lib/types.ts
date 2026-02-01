export interface User {
  id: string;
  name: string;
  email: string;
  year: string;
  created_at?: string;
  avatar_url?: string;
}

export interface Skill {
  id: number;
  user_id: string;
  skill_name: string;
}

export interface Goal {
  id: number;
  user_id: string;
  goal_text: string;
  status: 'pending' | 'completed';
}

export interface Badge {
  id: number;
  user_id: string;
  badge_name: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export type UserProfile = User & {
  skills: Skill[];
  goals: Goal[];
  badges: Badge[];
};
