export interface User {
  id: string;
  name: string;
  email: string;
  year: string;
  created_at?: string;
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

export type UserProfile = User & {
  skills: Skill[];
  goals: Goal[];
  badges: Badge[];
};
