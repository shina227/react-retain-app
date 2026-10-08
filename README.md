# Retain

A personal expense and monthly budget manager. React + TypeScript (Vite) frontend, Express + Prisma + PostgreSQL REST API.

> 🚧 In active development. The live app URL, features, screenshots and full setup guide will be added here.

**Live API:** https://retain-api-dwgm.onrender.com · health check: [`/api/health`](https://retain-api-dwgm.onrender.com/api/health)
(Free tier: the first request after idle can take 30–60s while the server wakes up.)

See [docs/api.md](docs/api.md) for the API reference.

## Repository layout

```
client/   React + TypeScript + Vite frontend (coming soon)
server/   Express 5 + Prisma 7 + PostgreSQL REST API
docs/     API reference (docs/api.md)
```

## Quick start (API)

```bash
cd server
npm install
cp .env.example .env   # then fill in DATABASE_URL, DIRECT_URL and JWT_SECRET
npm run db:migrate
npm run db:seed
npm run dev            # http://localhost:4000/api/health
```
