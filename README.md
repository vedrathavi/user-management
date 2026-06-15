# User Management

This repository is a pnpm + Turborepo monorepo for a user management product. It currently contains:

- [apps/web](apps/web): a React + Vite + Tailwind user management dashboard
- [apps/api](apps/api): a NestJS + TypeORM API for user CRUD operations
- [packages/types](packages/types): shared TypeScript types used by both apps

## What It Offers

The project is centered around managing users with a table-driven UI and a REST API.

- Create, edit, and delete users in the web app.
- Filter users by name, email, department, phone, role, status, and created date range.
- Validate user forms with `react-hook-form` and `zod`.
- Persist users through a NestJS API backed by TypeORM and PostgreSQL.
- Share user role and status types across the monorepo.

## What Has Been Implemented So Far

### Web App

The frontend is already built as a working user dashboard, but it currently runs against local mock state rather than calling the API.

- User list rendered in a table with 30 generated mock users.
- Add and edit user modal with form validation.
- Delete confirmation dialog before removing a user.
- Column-level filtering for first name, last name, email, phone, department, and created date.
- Role and status filtering support through the shared filter model.
- Shared UI pieces such as `UserTable`, `UserForm`, `FilterMenu`, and `ConfirmDialog`.
- Mock dataset generation using `@faker-js/faker`.

### API

The backend is already wired for database-backed user management.

- `GET /users` to list users.
- `GET /users/:id` to fetch one user.
- `POST /users` to create a user.
- `PATCH /users/:id` to update a user.
- `DELETE /users/:id` to remove a user.
- Unique email handling with a conflict response.
- Postgres connection configured through NestJS Config and TypeORM.
- Shared validation DTOs for create and update flows.

### Shared Types

- `packages/types` defines the shared `User`, `UserRoles`, and `UserStatus` types.

## Project Structure

- Web users page: [apps/web/src/pages/UsersPage.tsx](apps/web/src/pages/UsersPage.tsx)
- Web filtering logic: [apps/web/src/utils/filters.ts](apps/web/src/utils/filters.ts)
- Web form schema: [apps/web/src/utils/userSchema.ts](apps/web/src/utils/userSchema.ts)
- Web mock data: [apps/web/src/data/mockUsers.ts](apps/web/src/data/mockUsers.ts)
- API users controller: [apps/api/src/users/users.controller.ts](apps/api/src/users/users.controller.ts)
- API users service: [apps/api/src/users/users.service.ts](apps/api/src/users/users.service.ts)
- API user entity: [apps/api/src/users/entities/user.entity.ts](apps/api/src/users/entities/user.entity.ts)

## Getting Started

1. Install Node.js 20 or newer.
2. Install dependencies from the repository root.

```bash
pnpm install
```

3. Start both apps from the repository root.

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

- Web app (`apps/web`):
	- User management UI built with React + Vite + Tailwind.
	- Users list with pagination-style mock dataset (30 generated users).
	- Create / Edit user modal form using `react-hook-form` + `zod` validation.
	- Delete with confirmation dialog.
	- Column-level filtering (first name, last name, email, department, phone) with operators: `contains`, `equals`, `startsWith`, `endsWith`.
	- Mock data from `apps/web/src/data/mockUsers.ts` using `@faker-js/faker`.
	- UI components include `UserTable`, `UserForm`, `FilterMenu`, and `ConfirmDialog`.

- API (`apps/api`):
	- NestJS skeleton service and server configuration.
	- No database wired yet — currently serves as a placeholder for future API endpoints.

- Packages:
	- `packages/types` contains shared TypeScript types used across the monorepo (e.g. `User`, `UserRoles`, `UserStatus`).

## Quick Feature Map

- Users page: `apps/web/src/pages/UsersPage.tsx` — combines the mock dataset, table, form, and filter logic.
- Filtering logic: `apps/web/src/utils/filters.ts` — provides `applyFilters` and the `UserFilters` type.
- Form validation/schema: `apps/web/src/utils/userSchema.ts` — Zod schema and `UserFormData` type.
- Mock dataset: `apps/web/src/data/mockUsers.ts`.

There are no server-side persistence layers or external integrations configured yet.

## Where the Wiring Lives

- Root scripts: [package.json](package.json)
- Turbo task config: [turbo.json](turbo.json)
- Web app: [apps/web](apps/web)
- API: [apps/api](apps/api)
