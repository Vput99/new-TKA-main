import { getSupabase } from '../lib/supabase';

export interface Profile {
  id: string;
  role: 'student' | 'teacher';
  full_name: string;
  nisn?: string;
  faculty_id?: string;
  access_code?: string; // Added for student login simulation
  password?: string; // Added for teacher login simulation
  class?: string; // Added for student's class
}

export interface QuestionOption {
  id: string;
  text: string;
  image_url?: string;
}

export interface QuestionTableData {
  headers: string[];
  rows: { id: string; text: string; [key: string]: any }[];
}

export type QuestionType = 'multiple_choice' | 'multiple_answer' | 'true_false' | 'table_true_false' | 'short_answer' | 'matching';

export interface Question {
  id: string;
  subject_id: string;
  type: QuestionType;
  question_text: string;
  image_url?: string;
  options?: QuestionOption[];
  table_data?: QuestionTableData;
  correct_answer: any;
  explanation?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export const dbService = {
  // Auth helpers (simulated with database check if not using Supabase Auth)
  async loginStudent(nisn: string, accessCode: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('nisn', nisn)
      .eq('access_code', accessCode) // Assuming a simple access_code column for simulation
      .eq('role', 'student')
      .single();
    
    if (error) {
      console.error('Login Student Error:', error);
      throw error;
    }
    return data as Profile;
  },

  async loginTeacher(facultyId: string, password: string) {
    const supabase = getSupabase();
    // In a real app, use supabase.auth.signInWithPassword
    // For this simulation, we'll check a profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('faculty_id', facultyId)
      .eq('password', password) // Insecure, but following "simulation" pattern for now unless user asks for full Auth
      .eq('role', 'teacher')
      .single();
    
    if (error) {
      console.error('Login Teacher Error:', error);
      throw error;
    }
    return data as Profile;
  },

  // Data helpers
  async getProfiles(role: 'student' | 'teacher') {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role);
    if (error) throw error;
    return data as Profile[];
  },

  async getAllExamResults() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('exam_results')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getSubjects() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('subjects')
      .select('*');
    if (error) throw error;
    return data as Subject[];
  },

  async getQuestions(subjectId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('subject_id', subjectId);
    if (error) throw error;
    return data as Question[];
  },

  async getAllQuestions() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('questions')
      .select('*');
    if (error) throw error;
    return data as Question[];
  },

  async submitExamResult(studentId: string, subjectId: string, score: number) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('exam_results')
      .insert([
        { student_id: studentId, subject_id: subjectId, score, completed_at: new Date().toISOString() }
      ]);
    if (error) throw error;
    return data;
  },

  async addProfile(profile: Omit<Profile, 'id'>) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select();
    if (error) throw error;
    return data[0] as Profile;
  },

  async addQuestion(newQuestion: Omit<Question, 'id'>) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('questions')
      .insert([newQuestion])
      .select();
    if (error) throw error;
    return data[0] as Question;
  }
};
