# Plant Health Tracker

Modern React + Vite + Tailwind frontend concept for an AI Plant Health Tracker.

The backend now identifies plants with PlantNet and uses OpenRouter for detailed analysis and care guidance.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Environment

Set these variables before running the app:

- `VITE_API_BASE_URL` for the frontend API origin
- `VITE_GOOGLE_CLIENT_ID` for the frontend Google sign-in button
- `GOOGLE_CLIENT_ID` for backend Google token verification
- `JWT_SECRET` and `MONGODB_URI` for the session flow

## Build

```bash
npm run build
```

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React
