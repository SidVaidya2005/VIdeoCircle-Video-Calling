# Contributing to VideoCircle

Thanks for your interest in contributing. This project is a two-package
monorepo (`backend/` Express API + `frontend/` React CRA app) with no
workspaces tool — each package installs and runs independently.

## Local setup

```bash
git clone https://github.com/SidVaidya2005/VideoCircle.git
cd VideoCircle

# Backend (terminal 1)
cp backend/.env.example backend/.env   # fill in values
cd backend && npm install && npm run dev   # :8000

# Frontend (terminal 2)
cp frontend/.env.example frontend/.env  # fill in values
cd frontend && npm install && npm start    # :3000
```

Both `.env` files are required. The frontend will silently fail to connect
to video calls if `REACT_APP_LIVEKIT_URL` is missing. `LIVEKIT_URL` (backend)
and `REACT_APP_LIVEKIT_URL` (frontend) must point at the same LiveKit project.

## Before opening a PR

Run these in each package you touched:

```bash
npm run lint
npm run format:check
npm test
```

All three must pass — CI runs the same checks on every PR.

If you're touching frontend routing in `frontend/src/app/routes.jsx`, any
new top-level route (e.g. `/settings`) must be added **above** the catch-all
`/:meetingCode` route or it will be swallowed.

## Commit conventions

We aim for [Conventional Commits](https://www.conventionalcommits.org/) —
prefixes like `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
The pre-commit hook (Husky + lint-staged) auto-formats staged files.

GPG-signed commits are encouraged but not required. See
[GitHub's guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
to set up signing.

## Pull request checklist

- One logical change per PR — easier to review and revert.
- Update tests if you change behavior.
- Update `README.md`, `CLAUDE.md`, or package-level `CLAUDE.md` files if you
  change setup steps, architecture, or conventions.
- Fill in the PR template.

## Code of Conduct

By participating, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Reporting bugs / security issues

- **Bugs**: open a GitHub issue using the bug-report template.
- **Security vulnerabilities**: see [SECURITY.md](SECURITY.md) — please do
  not open a public issue.
