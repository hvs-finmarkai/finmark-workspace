# Finmark Workspace

Internal Employee Management & Collaboration Platform for Finmark.ai

## Overview

A production-ready SaaS platform where employees can securely log in, update their availability, view teammates, receive announcements, and collaborate. Administrators manage employees, departments, announcements, roles, and analytics from a separate portal.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components:** Custom component library (shadcn-inspired)
- **Animations:** Framer Motion
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL via Prisma ORM
- **Realtime:** Supabase Realtime
- **Authentication:** Auth.js (NextAuth v5) with Google OAuth + Credentials
- **State Management:** Zustand
- **Charts:** Recharts
- **Tables:** TanStack Table
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Hosting:** Vercel

## Features

### Authentication
- Google OAuth (primary, @finmark.ai only)
- Optional password creation after first Google login
- Role-based access control (Super Admin, Admin, Manager, Employee, HR)
- Middleware-protected routes

### Employee Portal
- Dashboard with status, projects, meetings, announcements
- Real-time status updates (Available, Busy, Away, Meeting, DND, Offline)
- Team Directory with search and filters
- Profile management with security settings
- Notifications center
- Project tracking with progress bars
- Calendar view
- Dark/Light mode

### Admin Portal
- Analytics dashboard with live employee status
- Employee management (CRUD, role assignment)
- Department management
- Announcement system with priority levels
- Role & permission management
- Reports (Daily/Weekly/Monthly, CSV/PDF export)
- Activity logs

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase)
- Google Cloud Console project (for OAuth)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/hvs-finmarkai/finmark-workspace.git
cd finmark-workspace
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure `.env` with your credentials:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database URL (for migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXTAUTH_URL` - App URL (http://localhost:3000)
- `NEXTAUTH_SECRET` - Random secret string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (portal)/          # Authenticated routes
│   │   ├── admin/         # Admin portal pages
│   │   ├── dashboard/     # Employee dashboard
│   │   ├── team/          # Team directory
│   │   ├── profile/       # User profile
│   │   ├── notifications/ # Notifications
│   │   ├── announcements/ # Announcements
│   │   ├── projects/      # Projects
│   │   ├── calendar/      # Calendar
│   │   └── settings/      # Settings
│   ├── api/               # API routes
│   └── login/             # Login page
├── components/
│   ├── dashboard/         # Dashboard widgets
│   ├── layout/            # Sidebar, TopBar
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, auth, prisma
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

## Security

- Google OAuth only with @finmark.ai domain restriction
- Middleware route protection
- Role-based access control
- bcrypt password hashing (Argon2 recommended for production)
- HTTP-only session cookies via JWT
- CSRF protection via Auth.js
- Input validation with Zod

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy --prod
```

Set all environment variables in your Vercel project settings.

## License

Private - Finmark.ai Internal Use Only
