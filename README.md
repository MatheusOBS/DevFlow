# DevFlow 🚀

DevFlow is a professional, high-performance SaaS task management application built with **React**, **TypeScript**, and **Supabase**.

![DevFlow Preview](./public/preview.png)

## ✨ Features

- **🏆 Kanban Board**: Drag-and-drop task management.
- **🏷️ Smart Organization**: Robust Tagging and Priority (Low/Medium/High) system.
- **🍅 Pomodoro Timer**: Integrated focus timer (25/5/15) to boost productivity.
- **📊 Analytics Dashboard**: Real-time insights with charts and KPIs.
- **🌙 Dark Mode**: Beautiful, system-aware dark theme.
- **⚡ Super Fast**: Powered by Vite and localized state updates.

## 🛡️ Security (Enterprise Grade)

- **Row Level Security (RLS)**: Database data is strictly isolated per user.
- **Content Security Policy (CSP)**: Client-side protection against XSS.
- **Secure Auth**: Powered by Supabase Authentication.

## 🛠️ Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion (animations).
- **Backend**: Supabase (PostgreSQL, Auth, Realtime).
- **Tools**: Vite, ESLint, Prettier.

## 🚀 Getting Started

1.  **Clone** the repo.
2.  **Install dependencies**: `npm install`
3.  **Setup Environment**:
    Create a `.env` file with your Supabase keys:
    ```env
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    ```
4.  **Run**: `npm run dev`

## 📄 License

MIT
