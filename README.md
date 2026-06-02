# User Management

This repo is a pnpm + Turborepo monorepo with two apps:

- [apps/web](apps/web): Vite + React + Tailwind frontend
- [apps/api](apps/api): NestJS API

## From Scratch

1. Install Node.js 20 or newer.
2. Make sure pnpm 10.34.1 is available. The repo is pinned to that version in [package.json](package.json).
3. Install dependencies from the repo root:

```bash
pnpm install
```

4. Start both apps from the repo root:

```bash
pnpm dev
```

That runs Turbo, which starts:

- the web app on http://localhost:5173/
- the API on http://localhost:3000/

5. Open the web app and confirm the Tailwind test card is visible.

## Compatible Versions

These are the versions this workspace is currently pinned to and tested with:

- Node.js: 20+
- pnpm: 10.34.1
- Turbo: 2.9.16
- React: 19.2.6
- React DOM: 19.2.6
- Vite: 8.0.12 in package metadata, resolved to 8.0.16 in the current install
- Tailwind CSS: 4.3.0
- NestJS: 11.0.1
- TypeScript: 6.0.2 in the web app, 5.7.3 in the API app

## Common Commands

```bash
pnpm build
```

Builds both apps from the root.

```bash
pnpm lint
```

Runs lint across both apps from the root.

```bash
pnpm --filter web dev
```

Starts only the web app.

```bash
pnpm --filter api dev
```

Starts only the API.

## What This Repo Does Right Now

- The web app is a simple Tailwind-styled screen with a visible test card.
- The API is a basic NestJS server with no database, migrations, or env setup yet.
- There are no hidden setup steps beyond installing dependencies and running the root dev command.

## Where the Wiring Lives

- Root scripts: [package.json](package.json)
- Turbo task config: [turbo.json](turbo.json)
- Web app: [apps/web](apps/web)
- API: [apps/api](apps/api)
