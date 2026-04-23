# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Drimboard is a platform for robotics kit owners. It has a Next.js 15 frontend and a FastAPI Python backend, deployed on AWS Amplify and AWS App Runner respectively.

## Development commands

### Backend (`drimboard_backend/`)

```bash
pip install -e .                                          # Install dependencies
uvicorn app.app:app --host 0.0.0.0 --port 5001 --reload  # Run dev server
```

### Frontend (`drimboard_frontend/`)

```bash
npm install        # Install dependencies
npm run dev        # Run dev server on port 3000
npm run build      # Production build
npm run lint       # Run ESLint
```

## Environment variables

**Backend** (`drimboard_backend/.env`):
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing key (required; app refuses to start without it)
- `S3_AWS_ACCESS_KEY_ID`, `S3_AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME` — AWS S3 for PDF course materials
- `FASTMAIL_USER`, `FASTMAIL_APP_PASSWORD`, `RECIPIENT_EMAIL` — contact form email sending via Fastmail SMTP
- `CORS_ALLOW_ALL=1` — allow all origins (useful for local development)
- `CORS_DEBUG=1` — log all CORS/preflight requests

**Frontend** (`drimboard_frontend/.env`):
- `NEXT_PUBLIC_API_URL` — backend URL (defaults to `http://localhost:5001`)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_PROJECT_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_DATASET` — Sanity CMS

## Architecture

### Backend (`drimboard_backend/`)

FastAPI app with SQLAlchemy ORM against a PostgreSQL database. All routes and Pydantic schemas live in `app/app.py`. Database models are in `app/database/models.py`; the engine/session factory in `app/database/database.py`.

**Database tables:**
- `drim_kits` — registered users with `kit_code` (used for authentication instead of passwords)
- `drim_course_chats` — per-course chat messages
- `issues` / `issue_comments` — community forum; tags stored as comma-separated text in a single `Text` column
- `user_blocks_workspaces` — saved block-coding workspaces; upserted by `(user_email, filename)`

**Auth flow:** Login requires email + kit_code matching a `drim_kits` row. No passwords. A JWT cookie is set on success and checked by the `/profile` endpoint.

**PDF delivery:** `POST /get_single_pdf` generates a 1-hour AWS S3 presigned URL for a course PDF.

**Deployment:** Gunicorn + Uvicorn workers on AWS App Runner. `apprunner.yaml` configures the runtime. The Dockerfile uses a two-stage build.

### Frontend (`drimboard_frontend/`)

Next.js 15 (App Router) with React 19. Static content (courses, activities, videos) is fetched from Sanity CMS via `src/lib/sanity.js`.

**State management:** Two parallel systems:
- `AuthContext` (`src/context/AuthContext.js`) — React context wrapping `AuthProvider` in `layout.js`; provides `user`, `login`, `logout`
- Zustand store (`src/store/useAppStore.js`) — global UI state; only the `logged` slice is persisted to `localStorage` via the `persist` middleware

On login, both are updated: `AuthContext` sets `user`, then the component calls `setLogged` on the store to persist the session.

**Key dependencies:**
- MUI (`@mui/material`) — UI components
- Three.js + `@react-three/fiber` + `@react-three/drei` — 3D rendering
- GSAP + Lenis — animations and smooth scroll
- Sanity (`@sanity/client`, `next-sanity`) — CMS content
- Zustand — global state with localStorage persistence
- Axios — all API calls; `NEXT_PUBLIC_API_URL` is the base URL

**Components structure:** Page sections are composed from `src/components/`. Materials/courses live under `src/components/materials/`. SVG illustrations are in `src/components/svgs/`. Each component has a corresponding CSS Module in `src/styles/`.
