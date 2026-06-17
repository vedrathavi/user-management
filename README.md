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

The frontend is a fully-featured user management dashboard that communicates directly with the NestJS backend API.

- **User Listing & Pagination**: Displays users retrieved from the Postgres database.
- **Dynamic Sorting & Pagination**: Sort by columns and paginated navigation.
- **Create, Edit & Delete**: Modals with form validation and confirmation dialogs.
- **Excel-Style Column Filtering**: Every column header (First Name, Last Name, Email, Phone, Role, Status, Department) features a dropdown filter menu that supports:
  - **Dynamic Dropdown Options**: Fetched dynamically from database distinct values.
  - **Cascading Options**: Filter dropdowns automatically narrow down based on active filters on other columns.
  - **Select All / Clear All**: Easy batch checking/unchecking.
  - **Search inside filter**: Sub-string filtering of the dropdown option list locally.
- **Shared UI Components**: `UserTable`, `UserForm`, `FilterMenu`, and `ConfirmDialog`.

## Remember our rules:

| Action | Admin | Editor | Viewer |
| :--- | :---: | :---: | :---: |
| View Users | ✅ | ✅ | ✅ |
| Create User | ✅ | ❌ | ❌ |
| Edit Name, Phone, Dept | ✅ | ✅ (Except Admins) | ✅ (Self Only) |
| Edit Status | ✅ | ✅ (Except Admins) | ❌ |
| Change Roles | ✅ (Except Self) | ❌ | ❌ |
| Delete User | ✅ (Except Self) | ❌ | ❌ |

## Authentication & Authorization

The project implements a complete JWT-based Authentication and Role-Based Access Control (RBAC) authorization system:

### Authentication Flow
- **Registration (`/auth/register`)**: New users can register. The default role assigned is `viewer` and default status is `active`.
- **Login (`/auth/login`)**: Users authenticate with credentials to receive a signed JWT access token.
- **Session Verification (`/auth/me`)**: Returns the currently authenticated user's profile and system role, triggered automatically on page load or token refresh.
- **Token Storage**: The JWT is saved in `localStorage`. All frontend API calls automatically attach `Authorization: Bearer <token>` to headers.
- **Token Expiry**: Centralized 401 response handling automatically logs out the user and redirects to the login screen.

### Client-Side RBAC Enforcement
- **Viewer**: Sees no "Add User" or "Delete" actions. Can only click the "Edit" button on *their own row* to modify their profile details (Role and Status selections are disabled and rendered as read-only badges).
- **Editor**: Sees the "Edit" button on all non-admin records (cannot edit Admins). Cannot delete users, change roles, or add new users.
- **Admin**: Full read, update, delete, and create permissions (except cannot delete or demote themselves, and cannot promote/create additional admins).


### API

The NestJS backend API handles persistence, query building, and dynamic metadata generation.

- **`POST /users/search`**: Main search, pagination, and sorting endpoint that also compiles dynamic, cascading filter options for all columns.
- **`GET /users/:id`**: Fetch single user.
- **`POST /users`**: Create user with unique email constraint checking.
- **`PATCH /users/:id`**: Update user details.
- **`DELETE /users/:id`**: Delete user record.
- **Postgres Integration**: Persistence backed by TypeORM and PostgreSQL.

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

- **Web app (`apps/web`)**:
	- React, Vite, and Tailwind-based dashboard.
	- Connects to the NestJS API for server-side state (listing, creating, editing, and deleting users).
	- Excel-style multi-select column filtering with local search, Select All, and cascading dropdown values.
	- Client-side form validation with `react-hook-form` and `zod`.

- **API (`apps/api`)**:
	- NestJS backend with full PostgreSQL integration via TypeORM.
	- Houses endpoints for search/filtering, creating, updating, and deleting users.
	- Implements dynamic query building for SQL-level filtering and cascading distinct options extraction.

- **Packages**:
	- `packages/types` contains shared TypeScript types (`User`, `UserRoles`, `UserStatus`).

## Quick Feature Map

- Users page: `apps/web/src/pages/UsersPage.tsx` — manages table query state (page, sorting, filters) and orchestrates API calls.
- Web filtering definitions: `apps/web/src/utils/filters.ts` — contains frontend types for search requests/responses.
- Form validation/schema: `apps/web/src/utils/userSchema.ts` — Zod schema for validation.

## Where the Wiring Lives

- Root scripts: [package.json](package.json)
- Turbo task config: [turbo.json](turbo.json)
- Web app: [apps/web](apps/web)
- API: [apps/api](apps/api)
