# Nabila Events Celebration — Event Production Platform

Full-stack **React + TypeScript + Tailwind CSS + Express** web application for event management, gallery showcases, past event case studies, client inquiry tracking, and organizer administration.

## Features

- **Frontend**: Responsive landing page with hero gallery strip, partner showcase, experiences, checklists, filterable gallery with lightbox, past events archive, and contact inquiry form.
- **Backend (`server.ts`, `server/`)**: Express REST API (`/api/*`) with persistent JSON storage (`data/db.json`) and session authentication.
- **Admin Dashboard**: Sign in to publish or remove events, manage client inquiries (`New` / `Reviewed` / `Scheduled`), and upload gallery showcases.

## Local Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack dev server (Express + Vite on port 3000)
npm run dev

# 3. Run unit tests
npm test

# 4. Typecheck and build for production
npm run lint
npm run build
npm start
```

## Adding Firebase Later

When you are ready to connect your own Google Firebase project:
1. Install `firebase` (`npm install firebase`).
2. Add your `VITE_FIREBASE_*` keys to `.env`.
3. Update `src/lib/firebaseConfig.ts` (`FIREBASE_ENABLED = true`) and connect your Firestore/Auth calls.
