export interface User {
  id: string;
  name: string;
  email: string;
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user_id: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
}