# Campus Canteen App

A hostel canteen ordering app for students, admins, and helpers.

## Features

- Student login and order flow
- Room delivery and pickup options
- Admin dashboard for order status updates
- Helper dashboard for delivery tracking
- Firebase authentication setup
- Firestore-ready order and user sync

## Roles

| Page | Route | Role |
|------|-------|------|
| Landing | `/` | Public |
| Login | `/login` | Public |
| Student Dashboard | `/student` | Student |
| Food Menu | `/menu` | Student |
| Cart | `/cart` | Student |
| Admin Dashboard | `/admin` | Admin |
| Helper Dashboard | `/helper` | Helper |

## Demo Login

| Role | Email | Password |
|------|-------|----------|
| Student | `student@campus.edu` | `student123` |
| Admin | `admin@campus.edu` | `admin123` |
| Helper | `helper@campus.edu` | `helper123` |

## Local Setup

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

## Firebase Setup

This project uses Firebase Authentication and Firestore.

1. Create a Firebase project.
2. Enable Authentication.
3. Enable Firestore Database.
4. Copy the example environment file:

```bash
copy .env.example .env
```

5. Fill in your Firebase values in `.env`.

Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> Important: never commit your real `.env` file to GitHub.

## Security Notes

- Sensitive Firebase config is stored in environment variables.
- `.env` is intentionally excluded from Git.
- Do not push API keys, project IDs, or private credentials to public repositories.

## Stack

- Vite + React
- React Router
- Firebase Auth
- Firestore
- CSS

## Notes

This project is built as a demo app for a hostel canteen workflow. It is suitable for academic or presentation use and can be extended with a real backend later if needed.
