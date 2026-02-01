import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getCurrentUser, addSkill } from '../lib/api';
import { UserProfile } from '../lib/types';
import { Plus, Award, Target, Book, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const user = await getCurrentUser();
      if (user) {
        const data = await getUserProfile(user.id);
        setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !profile) return;
    
    setAdding(true);
    
    // Call Supabase API
    const { data, error } = await addSkill(profile.id, newSkill.trim());
    
    if (error) {
        // Handle Setup Required
        if (error === 'SETUP_REQUIRED') {
            toast.error("Database setup required!");
            navigate('/setup');
            return;
        }

        // Handle constraint error (duplicate skill)
        if (typeof error === 'string' && error.includes('already exists')) {
             toast.error("You already have this skill!");
        } else {
             console.error("Failed to add skill:", error);
             toast.error("Failed to save skill.");
        }
        setAdding(false);
        return;
    }

    // Refresh profile or optimistic update
    if (data) {
        setProfile(prev => prev ? {
            ...prev,
            skills: [...prev.skills, data]
        } : null);
        setNewSkill('');
        toast.success("Skill added successfully!");
    }
    
    setAdding(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-500">Loading profile...</div>;
  }

  if (!profile) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Profile Not Found</h2>
            <p className="text-gray-600 mt-2">Please log in to view your profile.</p>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="relative px-8 pb-8">
          <div className="absolute -top-16 left-8">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 shadow-lg">
              {profile.name.charAt(0)}
            </div>
          </div>
          <div className="pt-20">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mr-2">
                {profile.year} Year
              </span>
              <span>{profile.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Stats & Badges */}
        <div className="space-y-8">
          {/* Badges */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Badges</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.badges.length > 0 ? (
                profile.badges.map((badge) => (
                  <span key={badge.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {badge.badge_name}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No badges yet. Start teaching!</p>
              )}
            </div>
          </div>
          
           {/* Level */}
           <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Level</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Beginner
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    30%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Skills & Goals */}
        <div className="md:col-span-2 space-y-8">
            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Book className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900">Skills I Can Teach</h3>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                            <span key={skill.id} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {skill.skill_name}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">Add skills to help others find you.</p>
                    )}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g. React, Python)"
                        disabled={adding}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                    />
                    <button 
                        type="submit" 
                        disabled={adding}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                    >
                        {adding ? 'Saving...' : <><Plus className="h-4 w-4 mr-1" /> Add</>}
                    </button>
                </form>
            </div>

            {/* Goals */}
             <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                    <Target className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">Learning Goals</h3>
                </div>
                <ul className="space-y-4">
                    {profile.goals.length > 0 ? (
                        profile.goals.map((goal) => (
                            <li key={goal.id} className="flex items-center">
                                <input type="checkbox" checked={goal.status === 'completed'} readOnly className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <span className={`ml-3 text-sm ${goal.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                    {goal.goal_text}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500 text-sm">No goals set yet.</li>
                    )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
