# Axiom (Autograder)

**Axiom** is a full-stack web application for computer-science style courses: faculty and TAs create assignments and rubrics, students submit code, and the system supports automated tests, manual grading, plagiarism awareness, and optional AI-related integrity signals. The UI is built for role-based workflows (student, faculty, TA, admin).

This repository contains the **Next.js** frontend and **FastAPI** backend that power the product.

## Tech stack

| Layer | Technologies |
|--------|----------------|
| Frontend | [Next.js](https://nextjs.org/) (React), TypeScript, TanStack Query, Monaco Editor, Tailwind CSS, Radix UI / MUI |
| Backend | [FastAPI](https://fastapi.tiangolo.com/), SQLAlchemy, PostgreSQL, JWT auth |
| Ops (local) | Docker Compose (Postgres only), optional `pipenv` / `requirements.txt` for Python |

## Repository layout

```
├── frontend/          # Next.js app (primary UI)
├── backend/           # FastAPI app and services
├── docker-compose.yml # Local PostgreSQL
├── .env.example       # Copy to .env and adjust
├── restart-dev.sh     # Optional: one-shot local dev bootstrap (macOS/Linux)
└── BACKEND_ENDPOINTS_DOCUMENTATION.md  # API notes and examples
```

## Prerequisites

- **Node.js** (LTS recommended) and npm  
- **Python 3.12+** (3.14 used in some dev setups is fine)  
- **Docker** and Docker Compose (for the database)  
- A **virtual environment** for the backend (example below uses `.venv` at the repo root)

## Quick start (local development)

### 1. Clone and environment file

```bash
git clone https://github.com/Sujitbh/Autograder.git
cd Autograder
cp .env.example .env
```

Edit `.env`: set `DATABASE_URL`, `JWT_SECRET`, and `NEXT_PUBLIC_API_URL` as needed. The example assumes the API lives at `http://localhost:8000/api`.

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Backend

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
```

Ensure `backend/.env` or the root `.env` is loaded (see `backend/app/settings.py` for `env_file` paths). Then:

```bash
python -m uvicorn app.main:app --app-dir backend --reload --host 0.0.0.0 --port 8000
```

- API base: **http://localhost:8000**  
- Interactive docs: **http://localhost:8000/docs**

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**.

### Optional: `restart-dev.sh`

If you are on macOS/Linux and already have `.venv` and dependencies installed:

```bash
chmod +x restart-dev.sh
./restart-dev.sh
```

This script starts Docker Compose, the backend on port **8000**, and the frontend on **3000** (and writes logs under `/tmp/`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js development server |
| `npm run build` / `npm run start` | Production build and server |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

## Features (high level)

- Role-based access: **students**, **faculty**, **teaching assistants**, **admin**
- **Assignments** with test cases, rubrics (weighted / unweighted), and grading workflows
- **TA dashboard**: course-scoped grading, tests, and permissions
- **Integrity tooling**: plagiarism-related flows and AI-signal UI where enabled
- Optional **MFA / OTP** (configured via environment variables; see `.env.example`)

## API documentation

For endpoint-oriented notes and examples, see **[BACKEND_ENDPOINTS_DOCUMENTATION.md](./BACKEND_ENDPOINTS_DOCUMENTATION.md)**. The live OpenAPI schema is always available at `/docs` when the backend is running.

## Archive snapshot

An older full tree (including the legacy `autograder/` stack and pre-cleanup docs) is preserved on the branch **`archive/legacy-full-codebase`** and the tag **`archive/pre-cleanup-2026-04`**. Current development should use **`main`** and the `frontend/` + `backend/` layout only.

## Security notes for production

- Change **`JWT_SECRET`** and database credentials; never commit real `.env` files.
- Review **MFA**, CORS, and email provider settings in `backend/app/settings.py` and your deployment environment.
- Run behind HTTPS and restrict admin registration as appropriate (`ALLOW_ADMIN_REGISTRATION`).

## Contributing

This project has multiple contributors. Use branches and pull requests; keep secrets out of Git.

## License

Specify a license if you open-source the repo (e.g. MIT). Until then, all rights may be reserved by the authors and their institution.

---

**Maintainers:** See [Contributors](https://github.com/Sujitbh/Autograder/graphs/contributors) on GitHub.
