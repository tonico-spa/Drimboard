# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
