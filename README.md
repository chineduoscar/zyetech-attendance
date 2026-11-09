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

The backend applies database table changes during startup and listens on port `3000` by default. Interactive Swagger documentation is available at `http://localhost:3000/api-docs`, with the OpenAPI JSON at `http://localhost:3000/api-docs.json`.

The backend uses Winston to write structured JSON logs to standard output. Set `LOG_LEVEL` to `error`, `warn`, `info` (default), `http`, `verbose`, `debug`, or `silly` to control verbosity. Each HTTP request log includes its request ID, method, path, status, duration, and authenticated user ID/role when available. The response `X-Request-Id` header can be used to find the corresponding log entry. Errors include stack details; credentials, request bodies, and query strings are not logged. In local development, view the backend terminal; in production, use the hosting provider's application logs.

### 2. Configure and start the frontend

From this project folder:

```sh
npm install
npm run dev
```

Vite proxies `/api` requests to `http://localhost:3000`. Leave `VITE_API_BASE_URL` empty for local development. For a separately hosted API, set it to the API origin in the frontend environment.

### Netlify and Render deployment

The production frontend sends API requests to its own origin (`/api/...`). The `public/_redirects` rule proxies those requests to `https://zyetech-attendance-api.onrender.com`, keeping the browser and authentication cookie on the Netlify site instead of making cross-site API requests. Production builds intentionally ignore `VITE_API_BASE_URL`; do not set it to the Render URL in Netlify.

In the Render backend environment, set `CORS_ORIGINS` to the exact public Netlify site origin (for example, `https://your-site.netlify.app`, without a trailing slash). Include additional frontend origins as a comma-separated list only if they should be allowed. Redeploy the frontend on Netlify and restart/redeploy the backend on Render after changing environment variables.

## First superadmin setup

1. Start the backend and register the intended superadmin account through `/register`.
2. Set `BOOTSTRAP_SUPERADMIN_EMAIL` in the backend environment to that account's email and restart the backend. On startup, it promotes that account only if no superadmin exists yet.
3. Remove the bootstrap variable after a superadmin has been created.

Do not set this variable to an email address that should not receive full user-management privileges.

## Authentication and user management

| URL | Page |
| --- | --- |
| `/admin/login` | Sign in |
| `/register` | Create an unapproved account with no assigned role |
| `/pending-approval` | Explain pending approval or role assignment |
| `/admin/users` | Superadmin-only user directory |

The frontend verifies sessions through `GET /api/auth/me` before showing protected admin pages. The backend authenticates requests from the `HttpOnly` `zyetech_auth` cookie (and retains bearer-token support for existing API clients), and reloads the user's current role from PostgreSQL for protected requests.

Relevant endpoints:

- `POST /api/auth/register` — creates an unapproved account without a role; request-supplied roles are ignored.
- `POST /api/auth/login` — authenticates and sets the cookie.
- `GET /api/auth/me` — returns the current user.
- `POST /api/auth/logout` — clears the cookie.
- `GET /api/users` — lists users for superadmins only.
- `PATCH /api/users/:id/approval` — superadmin approves or suspends an account.
- `PATCH /api/users/:id/role` — superadmin assigns `admin` or `superadmin` to an approved account.

There are only two roles: `admin` and `superadmin`. New accounts are unapproved and have no role. A superadmin must both approve an account and assign one of those roles before it can access the dashboard. Suspending an account disables access without introducing a third role. These rules are enforced by the backend; users cannot change their own account, and the last approved superadmin cannot be demoted or suspended.

### Deployment configuration

Configure the backend environment:

- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — long, random signing secret; never expose this to the frontend.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` — backend-only credentials used to store generated receipt PDFs in Cloudinary.
- `CORS_ORIGINS` — comma-separated, exact frontend origins.
- `AUTH_COOKIE_SAME_SITE` — defaults to `Lax`. For a frontend and API on different sites, set to `None`.
- In production, cookies are always `Secure`; `SameSite=None` therefore requires HTTPS.
- `BOOTSTRAP_SUPERADMIN_EMAIL` — optional one-time initial superadmin setup described above.

For cross-site deployments, the browser must be allowed to send credentialed requests, the API must return the exact allowed CORS origin with credentials enabled, and the frontend API URL must point to the Express API. Cookie-authenticated state-changing requests are restricted to configured origins.

## Database-backed app pages

The backend creates the application tables when it starts. Students, staff, attendance submissions, receipts created through the backend API, and administrator accounts are stored in PostgreSQL and are shared across browsers and devices. The `/admin/receipts/generate` page saves receipt details in PostgreSQL and the generated PDF in Cloudinary.

| Admin page | Data |
| --- | --- |
| `/admin/dashboard` | Live student/staff totals, today's attendance, and this month's receipts |
| `/admin/students` | Create, edit, and list student profiles (name, email, phone, course, status) |
| `/admin/staff` | Create, edit, and list staff profiles (name, email, phone, status) |
| `/admin/student/attendance` | Student attendance submitted by the public student form |
| `/admin/staff/attendance` | Staff attendance submitted by the public staff form |
| `/admin/receipts/generate` | Generate a payment receipt, save it in PostgreSQL, and store its PDF in Cloudinary |
| `/admin/receipts` | Browse receipts; superadmins can delete a receipt and its Cloudinary file |
| `/admin/users` | Superadmins approve accounts and manage administrator roles |

Attendance forms and sign-out forms are public and write directly to PostgreSQL. Staff and students sign out by entering their ID on `/staff/sign-out` or `/student/sign-out`. The attendance record stores time in when attendance is marked and leaves time out blank until sign-out. The retired attendance submission API endpoints return `410 Gone`; clients must use the current `/sign-in` endpoints. Reading attendance and managing directories or receipts requires an admin/superadmin session. Only superadmins can delete student/staff directory records; deleting a student leaves their receipts saved and unlinks them from the deleted profile. Receipts without a supplied receipt number receive one generated by the backend.

Main API endpoints:

- `POST /api/student-attendance/sign-in` and `POST /api/staff-attendance/sign-in` — public attendance submissions.
- `POST /api/student-attendance` and `POST /api/staff-attendance` — retired; return `410 Gone`.
- `POST /api/student-attendance/sign-out` and `POST /api/staff-attendance/sign-out` — public sign-out by student/staff ID; records time out for today's attendance.
- `GET /api/student-attendance` and `GET /api/staff-attendance` — admin attendance lists.
- `GET|POST /api/students` and `GET|POST /api/staff` — admin directory operations.
- `PUT|DELETE /api/students/:id` and `PUT|DELETE /api/staff/:id` — update directory records; delete is superadmin-only.
- `GET|POST /api/receipts` — admin receipt listing and generation.
- `DELETE /api/receipts/:id` — superadmin deletes a receipt and its Cloudinary PDF.
- `GET /api/analytics` — admin dashboard totals.

Existing browser-local attendance records are not automatically imported into PostgreSQL. They remain only in the browser storage where they were originally recorded.

Receipts are matched to student profiles by an exact, case-insensitive name match. A receipt can be saved before a matching student ID exists; registering a student with the same name links the existing receipt. Receipt files are stored in Cloudinary and remain available if a linked student profile is deleted.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend into `dist/` |
| `npm run preview` | Preview the production frontend build |
| `npm run lint` | Run ESLint |

Deploy the frontend as a static site with SPA fallback to `index.html` for nested routes such as `/admin/dashboard`.
