# DevFlow

DevFlow is a production-ready Full Stack Task Management application designed to demonstrate professional software engineering skills. It features a modern React frontend, a Node.js/Express backend, and secure authentication using JWT and Supabase (PostgreSQL).

**Author:** Full Stack Developer

## Tech Stack

### Frontend
*   **React 18** (Vite)
*   **TypeScript**
*   **Tailwind CSS** (Styling)
*   **Axios** (API Integration)
*   **Context API** (State Management)

### Backend
*   **Node.js**
*   **Express**
*   **PostgreSQL** (via Supabase)
*   **JWT** (Authentication)
*   **Bcrypt** (Password Hashing)

## Features
*   **Authentication:** Secure Login & Registration with JWT.
*   **Task CRUD:** Create, Read, Update, and Delete tasks.
*   **State Management:** Optimistic UI updates and responsive feedback.
*   **Filtering:** Filter tasks by status (Pending/Completed).
*   **Security:** Protected routes and password hashing.
*   **Responsive:** Mobile-first design using Tailwind CSS.

## Project Structure

```
devflow/
├── frontend/ (Root in this preview)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # View controllers
│   │   ├── services/    # API & Auth logic
│   │   └── context/     # Global state
├── backend/
│   ├── controllers/ # Business logic
│   ├── routes/      # API endpoints
│   ├── middlewares/ # Auth & Error handling
│   └── server.ts    # Entry point
```

## Setup & Installation

### 1. Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

### 2. Database Setup (Supabase SQL)
Run the following SQL in your Supabase SQL Editor:
```sql
create table users (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text default 'pending',
  user_id uuid references users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 3. Running the Backend
```bash
cd backend
npm install
npm start
```

### 4. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

> **Note for Demo:** This live preview uses a `mockBackend` service by default to demonstrate functionality without a running Node server. To connect to a real local backend, change `USE_MOCK_BACKEND` to `false` in `constants.ts`.
