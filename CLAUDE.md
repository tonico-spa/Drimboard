# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<<<<<<< HEAD
## Repository layout

Two independent apps in one repo, deployed separately:

- `drimboard_backend/` — Python API (FastAPI, despite the package being named `drimboard` and pyproject.toml listing Flask deps). Entry point is `app/app.py`, exposed as `app.app:app`. Production runs on AWS App Runner (`apprunner.yaml`) and/or the included `Dockerfile`. Frontend is on AWS Amplify (`*.amplifyapp.com` and `www.drim.cl`).
- `drimboard_frontend/` — Next.js 15 (App Router) on React 19, using JavaScript (not TypeScript). Path alias `@/*` → `./src/*` (`jsconfig.json`).

Each side has its own `.env`, neither is committed. The backend `pyproject.toml` lists Flask/Flask-Bcrypt/Flask-Cors as deps but they are unused — the live stack is FastAPI + Pydantic + SQLAlchemy + Passlib.

## Common commands

### Backend (`drimboard_backend/`)
```bash
# Install (editable) into a venv
pip install -e .

# Local dev — runs uvicorn on :5001 with reload (see __main__ block in app/app.py)
python app/app.py

# Production-equivalent run (matches Dockerfile / apprunner.yaml)
gunicorn --bind 0.0.0.0:8000 --workers 4 --worker-class uvicorn.workers.UvicornWorker app.app:app
```

There are no tests, lint config, or migration tooling. Tables are auto-created on startup via `Base.metadata.create_all` in `on_startup` (see `app/app.py`'s `create_tables`); add columns by editing `app/database/models.py` and either dropping the table or migrating manually — `create_all` will not alter existing tables.

### Frontend (`drimboard_frontend/`)
```bash
npm run dev      # next dev on :3000
npm run build
npm run start
npm run lint     # eslint with next/core-web-vitals
```

## Backend architecture

- **Single-file API**: `app/app.py` defines every route, every Pydantic schema, and CORS/JWT setup inline. There is no router/controller/service split. When adding endpoints, follow the existing inline pattern unless the user asks otherwise.
- **DB**: PostgreSQL via SQLAlchemy. `DATABASE_URL` is required; the app fails fast at import if missing. Models live in `app/database/models.py`; the engine/session in `app/database/database.py`. `get_db` is the FastAPI dependency.
- **Tables**: `drim_kits` (login: email + kit_code), `drim_course_chats`, `issues`, `issue_comments`. The forum stores `tags` as a comma-separated string in a single Text column and splits on read.
- **Auth**: `/login` only checks `(user_email, kit_code)` against `drim_kits` and returns a hardcoded name — there is no password hashing path active and no JWT is issued at login despite `passlib`/`PyJWT` being imported. `/profile` decodes a `token` cookie with `JWT_SECRET` (HS256), but no route currently sets that cookie. Treat auth as half-wired; preserve the existing shape unless explicitly asked to fix it.
- **CORS**: Allowed origins are hardcoded in `app/app.py` (localhost:3000, two Amplify domains, `https://www.drim.cl`). Set `CORS_ALLOW_ALL=1` for permissive mode and `CORS_DEBUG=1` to log preflight requests. When deploying to a new frontend host, append it to the `origins` list.
- **S3**: `/get_single_pdf` issues a 1-hour presigned GET URL. Requires `S3_AWS_ACCESS_KEY_ID`, `S3_AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`. Note these S3-specific names — they are not the standard `AWS_*` names boto3 would pick up automatically.
- **Mail**: `/send_form` sends contact-form submissions via Fastmail SMTP-SSL on port 465 (`utils.handle_contact_form`). Needs `FASTMAIL_USER`, `FASTMAIL_APP_PASSWORD`, `RECIPIENT_EMAIL`.
- **Import-path quirk** (be careful when moving code): `app/app.py` does `import utils`, `import aws_utils`, `from database import models, database` — bare imports that only resolve when the working directory is `app/`. Each of those lines has a commented-out `app.<module>` form. The Dockerfile and apprunner config run `gunicorn app.app:app` from the parent dir, so bare imports there only work because Python adds the script's dir to `sys.path` for the entry module — not for downstream imports. If you refactor or add a new module, prefer the `app.<module>` form and uncomment the existing alternates rather than introducing a third style.

## Frontend architecture

- **App Router is the entry**: `src/app/layout.js` wraps everything in `AuthProvider` + `Navbar`; `src/app/page.js` renders `<Main/>` + `<Footer/>`. The whole site is effectively one page — sub-views (Materials, Forum, login modal, single-course viewer) are toggled via Zustand flags, **not** routes. Don't add a Next route for a new section unless you've confirmed the user wants navigation; the established pattern is a flag in `useAppStore`.
- **A `src/pages/materials/index.js` also exists** (Pages Router). It is a near-duplicate of `src/components/materials/Materials.js` but is **not** the active Materials view — the App Router version is what loads. Treat `src/pages/` as legacy/dead; edit `src/components/materials/Materials.js` for changes that should be visible.
- **State**: `src/store/useAppStore.js` (Zustand + `persist` middleware). Only the `logged` slice is persisted to localStorage; everything else (`courses`, `actividades`, `videos`, `documents`, `issues`, modal toggles) is in-memory. Component data fetching populates these stores on mount.
- **Auth**: `src/context/AuthContext.js` exposes `{ user, loading, login, logout }` via `useAuth()`. `login(credentials)` posts `{ email, kit_code }` to `${API_URL}/login`. There is also `useAppStore.logged` — both exist; new code generally reads from `useAppStore` and writes to it on login success.
- **Content (Sanity)**: `src/lib/sanity.js` is the GROQ client. Schemas referenced in queries: `post`, `actividades`, `videos`, `pdf_document`. Required env: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_PROJECT_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_DATASET`.
- **API base URL**: `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5001` in several files). Several modules read it independently — when changing, grep all of `src/`.
- **Animation stack**: GSAP + ScrollTrigger drive the scroll-pinned sections in `Main.js`; Lenis (`@studio-freight/lenis`) provides smooth scroll. Three.js / react-three-fiber / opencascade.js are present for the STEP file viewer (`SetpViewer.js` — note the typo in the filename).
- **Styling**: CSS Modules per component under `src/styles/*.module.css` (file name matches the component, e.g. `Main.module.css`). MUI is also installed but used sparingly. Don't introduce Tailwind or styled-components without checking — the established pattern is CSS Modules.
- **UI strings are in Spanish** (`hace 1 minuto`, "Inicio / Material / Foro", etc.). Keep new user-facing copy in Spanish.

## Cross-app contract

The API endpoints the frontend depends on (in `src/components/materials/Materials.js`, `LoginForm.js`, contact form, etc.):
- `POST /login` — body `{ email, kit_code }`
- `GET /profile` — reads `token` cookie
- `POST /logout`
- `GET /get_course_messages`, `POST /create_course_message`
- `GET /issues`, `POST /issues`, `GET /issues/{id}`, `POST /issues/{id}/comments`
- `POST /get_single_pdf` — body `{ course_name }` (S3 key)
- `POST /send_form` — contact form

Schema changes on either side need a matching change on the other; there is no shared types package or OpenAPI generation.
=======
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
>>>>>>> 39acf30ee152e8028dac986d70f193ea283f7e18
