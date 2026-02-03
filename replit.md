# Desa Indeks System

## Overview
A village index assessment system (Desa Indeks) built with React, Express, and PostgreSQL. The application allows tracking and assessing villages based on various development indicators.

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express 5, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with bcrypt password hashing

## Project Structure
```
├── client/           # React frontend (Vite)
│   ├── src/          # Source files
│   └── index.html    # Entry HTML
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API routes
│   ├── db.ts         # Database connection
│   ├── auth.ts       # Authentication logic
│   ├── storage.ts    # Data storage layer
│   ├── static.ts     # Static file serving
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle schema definitions
│   └── routes.ts     # Shared route definitions
├── script/           # Build and seed scripts
└── migrations/       # Database migrations
```

## Database Schema
- **users**: User accounts with authentication
- **villages**: Village information (name, district, regency, province)
- **assessments**: Assessment records with scores and status
- **assessment_values**: Individual indicator values for assessments

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run seed:users` - Seed user data

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `SESSION_SECRET` - Session encryption key (optional, has default)
- `NODE_ENV` - Environment mode (development/production)

## Ports
- The application runs on port 5000 (frontend and backend combined)
