export interface User {
  id: number;
  username: string;
  display_name: string;
  created_at: string;
}

export interface ShootingSession {
  id: number;
  user_id: number;
  session_date: string;
  free_throws_made: number;
  free_throws_attempted: number;
  three_pointers_made: number;
  three_pointers_attempted: number;
  notes: string | null;
  created_at: string;
  // Joined fields
  user_display_name?: string;
}

export interface SessionFormData {
  user_id: number;
  session_date: string;
  free_throws_made: number;
  free_throws_attempted: number;
  three_pointers_made: number;
  three_pointers_attempted: number;
  notes?: string;
}

export interface StatsData {
  total_sessions: number;
  total_free_throws_made: number;
  total_free_throws_attempted: number;
  total_three_pointers_made: number;
  total_three_pointers_attempted: number;
  free_throw_percentage: number;
  three_pointer_percentage: number;
  overall_percentage: number;
}

export interface DailyStats extends StatsData {
  date: string;
}

export interface UserStats extends StatsData {
  user_id: number;
  display_name: string;
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
