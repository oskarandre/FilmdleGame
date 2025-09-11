Filmdle – Movie Guessing Game (Vite + React)

Setup

1. Install dependencies
   npm install

2. Create .env from example
   cp .env.example .env
   Fill in your keys.

3. Run dev server
   npm run dev

Environment variables (.env)

VITE_TMDB_BEARER=your_tmdb_v4_bearer_token
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

Architecture changes

- Centralized Firebase: src/lib/firebase.js
- Centralized TMDB client: src/lib/tmdb.js
- Removed duplicate firebase/ and authentication/ folders
- Removed scripts/api.js; components import from src/lib


