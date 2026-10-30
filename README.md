# Zyetech Attendance

React/Vite frontend and Express/PostgreSQL backend for Zyetech attendance, student/staff records, receipts, and administrator account management.

## Requirements

- Node.js (current LTS recommended) and npm
- PostgreSQL database

## Local development

The backend is maintained in the sibling `Zyetech-attendance-backend` folder.

### 1. Configure and start the backend

From the backend folder:

```sh
npm install
```

Copy `.env.example` to `.env`, then set `DATABASE_URL` and a long random `JWT_SECRET`. Start the server:

```sh
npm run dev
```

The backend applies database table changes during startup and listens on port `3000` by default.

### 2. Configure and start the frontend

From this project folder:

```sh
npm install
npm run dev
```

Vite proxies `/api` requests to `http://localhost:3000`. Leave `VITE_API_BASE_URL` empty for local development. For a separately hosted API, set it to the API origin in the frontend environment.

## First superadmin setup

1. Start the backend and register the intended superadmin account through `/register`.
2. Set `BOOTSTRAP_SUPERADMIN_EMAIL` in the backend environment to that account's email and restart the backend. On startup, it promotes that account only if no superadmin exists yet.
3. Remove the bootstrap variable after a superadmin has been created.

Do not set this variable to an email address that should not receive full user-management privileges.

## Authentication and user management

| URL | Page |
| --- | --- |
| `/admin/login` | Sign in |
| `/register` | Create a regular, pending account |
| `/pending-approval` | Explain approval or missing admin access |
| `/admin/users` | Admin user directory; role/approval actions are superadmin-only |

The frontend verifies sessions through `GET /api/auth/me` before showing protected admin pages. The backend authenticates requests from the `HttpOnly` `zyetech_auth` cookie (and retains bearer-token support for existing API clients), and reloads the user's current role from PostgreSQL for protected requests.

Relevant endpoints:

- `POST /api/auth/register` — creates a regular user with pending approval; request-supplied roles are ignored.
- `POST /api/auth/login` — authenticates and sets the cookie.
- `GET /api/auth/me` — returns the current user.
- `POST /api/auth/logout` — clears the cookie.
- `GET /api/users` — lists users for admins and superadmins.
- `PATCH /api/users/:id/approval` — superadmin approves a regular user.
- `PATCH /api/users/:id/role` — superadmin assigns or revokes admin roles.

Approval and role are separate: approving an account does not give it dashboard access. Only `admin` and `superadmin` roles can enter the admin section. Role changes and approval are enforced on the backend; users cannot change their own account, and the last superadmin cannot be demoted.

### Deployment configuration

Configure the backend environment:

- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — long, random signing secret; never expose this to the frontend.
- `CORS_ORIGINS` — comma-separated, exact frontend origins.
- `AUTH_COOKIE_SAME_SITE` — defaults to `Lax`. For a frontend and API on different sites, set to `None`.
- In production, cookies are always `Secure`; `SameSite=None` therefore requires HTTPS.
- `BOOTSTRAP_SUPERADMIN_EMAIL` — optional one-time initial superadmin setup described above.

For cross-site deployments, the browser must be allowed to send credentialed requests, the API must return the exact allowed CORS origin with credentials enabled, and the frontend API URL must point to the Express API. Cookie-authenticated state-changing requests are restricted to configured origins.

## Database-backed app pages

The backend creates the application tables when it starts. Students, staff, attendance submissions, receipts created through the backend API, and administrator accounts are stored in PostgreSQL and are shared across browsers and devices. The `/admin/receipts/generate` page currently generates a downloadable PDF in the browser only; it does not submit or save payment data.

| Admin page | Data |
| --- | --- |
| `/admin/dashboard` | Live student/staff totals, today's attendance, and this month's receipts |
| `/admin/students` | Create, edit, and list student profiles (name, email, phone, course, status) |
| `/admin/staff` | Create, edit, and list staff profiles (name, email, phone, status) |
| `/admin/attendance/students` | Student attendance submitted by the public student form |
| `/admin/attendance/staff` | Staff attendance submitted by the public staff form |
| `/admin/receipts/generate` | Generate and download a payment receipt locally; not persisted |
| `/admin/receipts` | Browse saved receipts |
| `/admin/users` | Approve accounts and manage administrator roles |

Attendance forms are public and write directly to PostgreSQL. Reading attendance and managing directories or receipts requires an admin/superadmin session. Only superadmins can delete student/staff directory records; students with payment receipts cannot be deleted. Receipt numbers are generated by the backend from the persistent receipt ID.

Main API endpoints:

- `POST /api/student-attendance` and `POST /api/staff-attendance` — public attendance submissions.
- `GET /api/student-attendance` and `GET /api/staff-attendance` — admin attendance lists.
- `GET|POST /api/students` and `GET|POST /api/staff` — admin directory operations.
- `PUT|DELETE /api/students/:id` and `PUT|DELETE /api/staff/:id` — update directory records; delete is superadmin-only.
- `GET|POST /api/receipts` — admin receipt listing and generation.
- `GET /api/analytics` — admin dashboard totals.

Existing browser-local attendance records are not automatically imported into PostgreSQL. They remain only in the browser storage where they were originally recorded.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend into `dist/` |
| `npm run preview` | Preview the production frontend build |
| `npm run lint` | Run ESLint |

Deploy the frontend as a static site with SPA fallback to `index.html` for nested routes such as `/admin/dashboard`.
