import { supabase } from "./supabase";
import { Task, User } from "../types";

// Helper to map Supabase User to App User
const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email!,
  name: u.user_metadata?.name || u.email?.split("@")[0] || "User",
});

export const authService = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Map Supabase user to App user type
    const user = mapUser(data.user);
    return { user, token: data.session?.access_token || "" };
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
    const user = data.user ? mapUser(data.user) : { id: "", name, email };
    return { user, token: data.session?.access_token || "" };
  },
};

export const taskService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Filter out tasks with invalid dates to prevent UI crashes
    const tasks = (data || []) as Task[];
    return tasks.filter((task) => {
      const isStartValid =
        !task.start_date || !isNaN(new Date(task.start_date).getTime());
      const isEndValid =
        !task.end_date || !isNaN(new Date(task.end_date).getTime());
      return isStartValid && isEndValid;
    });
  },
  create: async (
    title: string,
    description: string,
    start_date?: string,
    end_date?: string,
    priority: string = "medium",
    tags: string[] = [],
  ) => {
    // Get current user
    // Get current user (use getSession for better resilience if getUser fails due to email/network)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      // User requested removal of auth check, but we need an ID.
      // We'll throw detailed info so they know WHY it failed if it truly is null.
      throw new Error(
        "Usuario não encontrado na sessão. Faça login novamente.",
      );
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          description,
          user_id: user.id,
          status: "pending",
          start_date,
          end_date,
          priority,
          tags,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },
  update: async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
  },
};
