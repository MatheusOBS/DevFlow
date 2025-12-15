import { Task, User, TaskStatus, AuthResponse } from '../types';
import { TOKEN_KEY, USER_KEY } from '../constants';

// Simulated Database in LocalStorage
const STORAGE_TASKS = 'devflow_mock_tasks';
const STORAGE_USERS = 'devflow_mock_users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getTasks = (): Task[] => JSON.parse(localStorage.getItem(STORAGE_TASKS) || '[]');
const saveTasks = (tasks: Task[]) => localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));

const getUsers = (): any[] => JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
const saveUsers = (users: any[]) => localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

// Seed initial data
if (!localStorage.getItem(STORAGE_USERS)) {
    saveUsers([{ id: '1', name: 'Usuário Demo', email: 'demo@devflow.com', password: 'password123' }]);
}

export const mockApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(800);
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPass } = user;
      const token = `mock-jwt-token-${Date.now()}`;
      return { user: userWithoutPass, token };
    }
    throw new Error('Credenciais inválidas');
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    await delay(800);
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('Usuário já existe');
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    saveUsers([...users, newUser]);
    
    const { password: _, ...userWithoutPass } = newUser;
    return { user: userWithoutPass, token: `mock-jwt-token-${Date.now()}` };
  },

  getTasks: async (): Promise<Task[]> => {
    await delay(500);
    return getTasks();
  },

  createTask: async (title: string, description: string): Promise<Task> => {
    await delay(500);
    const tasks = getTasks();
    // Simulate getting user ID from "token"
    const userStr = localStorage.getItem(USER_KEY);
    const userId = userStr ? JSON.parse(userStr).id : '1';
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: TaskStatus.PENDING,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    saveTasks([newTask, ...tasks]);
    return newTask;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(400);
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tarefa não encontrada');
    
    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    saveTasks(tasks);
    return updatedTask;
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(400);
    const tasks = getTasks();
    saveTasks(tasks.filter(t => t.id !== id));
  }
};