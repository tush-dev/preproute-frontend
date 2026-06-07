# Preproute Test Management Frontend

React + TypeScript implementation of the 5-page test management flow:

- Login
- Dashboard / test list
- Create and edit test details
- Add MCQ questions
- Preview and publish

## Setup

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## API

Base URL:

```txt
https://admin-moderator-backend-staging.up.railway.app/api
```

Test credentials:

```txt
User ID: vedant-admin
Password: vedant123
```

## Technical Decisions

- React Router v6 is used for the required page flow and protected routes.
- Zustand is used instead of Redux because this app has small shared state: auth, current test, catalog data, and draft questions.
- React Hook Form + Zod handle validation with fewer re-renders and typed form values.
- Axios centralizes API calls and applies the JWT auth header through an interceptor.
- React Hot Toast provides success/error feedback for login, save, question creation, and publish actions.
- Styling follows the provided Figma direction with custom CSS while Tailwind tooling is installed for future utility-class expansion.
