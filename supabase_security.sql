-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only see their own tasks
CREATE POLICY "Users can view own tasks" 
ON tasks FOR SELECT 
USING (auth.uid() = user_id);

-- Create Policy: Users can insert tasks (assigning to themselves)
CREATE POLICY "Users can insert own tasks" 
ON tasks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create Policy: Users can update their own tasks
CREATE POLICY "Users can update own tasks" 
ON tasks FOR UPDATE 
USING (auth.uid() = user_id);

-- Create Policy: Users can delete their own tasks
CREATE POLICY "Users can delete own tasks" 
ON tasks FOR DELETE 
USING (auth.uid() = user_id);
