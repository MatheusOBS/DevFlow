import { supabase } from './supabase';
import { Task, User } from '../types';

// Helper to map Supabase User to App User
const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email!,
  name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
});

export const authService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Map Supabase user to App user type
    const user = mapUser(data.user);
    return { user, token: data.session?.access_token || '' };
  },
  register: async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Store name in metadata
      },
    });
    if (error) throw error;
    
    // Note: data.user might be null if email confirmation is enabled and required immediately
    // For this setup we assume it returns the user
    const user = data.user ? mapUser(data.user) : { id: '', name, email };
    return { user, token: data.session?.access_token || '' };
  },
};

export const taskService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Task[];
  },
  create: async (title: string, description: string) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario nao autenticado');

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title,
        description,
        user_id: user.id,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },
  update: async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};