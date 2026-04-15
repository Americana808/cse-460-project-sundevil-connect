# SunDevil Connect

A student club management and engagement platform for Arizona State University. Students can discover and join clubs, club leaders can manage members and post events, and admins can oversee all activity on the platform.

---

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React 18 + Vite               |
| Routing  | React Router v6               |
| Backend  | Node.js + Express 5           |
| Database | SQLite (via better-sqlite3)   |
| Auth     | JWT (jsonwebtoken) + bcryptjs |

---

## Project Structure

```
/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── api/              # API call wrappers (apiFetch, auth, clubs, events, admin)
│       ├── components/       # Shared components (Navbar, ClubCard, EventCard, ProtectedRoute)
│       ├── context/          # AuthContext — JWT state management
│       ├── hooks/            # useAuth hook
│       └── pages/            # One file per route/page
├── server/                   # Express backend
│   └── src/
│       ├── controllers/      # Business logic per resource
│       ├── middleware/        # authenticate.js — JWT verification
│       ├── models/           # SQLite schema + db connection
│       └── routes/           # Route definitions per resource
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### 1. Clone the repository

```bash
git clone <repo-url>
cd cse-460-project-sundevil-connect
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```
JWT_SECRET=your_long_random_secret_here
```

> Generate a strong secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Set up the frontend

```bash
cd ../client
npm install
```

### 4. Run the project

Open **two terminals**:

**Terminal 1 — Backend**

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

| Variable     | Location      | Description                                                                     |
| ------------ | ------------- | ------------------------------------------------------------------------------- |
| `JWT_SECRET` | `server/.env` | Secret key used to sign and verify JWTs. Keep this private and never commit it. |

---

## User Roles

| Role          | How to create                       | Capabilities                                                                  |
| ------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| `student`     | Register in the browser             | Browse clubs/events, join clubs, register for events                          |
| `club_leader` | Register in the browser             | All student actions + create clubs/events, manage members, post announcements |
| `admin`       | Must be created via API (see below) | Full platform oversight, approve/reject clubs, manage flags, delete clubs     |

### Creating an admin account

The registration form intentionally does not expose the admin role. Use the browser DevTools console (F12) with the server running:

```js
fetch("http://localhost:5000/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "Admin",
    lastName: "User",
    email: "admin@asu.edu",
    password: "password123",
    role: "admin",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

---

## API Overview

All routes except `/api/auth/register` and `/api/auth/login` require a valid JWT in the `Authorization: Bearer <token>` header.

### Auth

| Method | Route                | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Create a new account         |
| POST   | `/api/auth/login`    | Login, returns JWT token     |
| POST   | `/api/auth/logout`   | Logout (client clears token) |

### Clubs

| Method | Route                                      | Access             | Description           |
| ------ | ------------------------------------------ | ------------------ | --------------------- |
| GET    | `/api/clubs`                               | Any                | List all clubs        |
| POST   | `/api/clubs`                               | Any                | Petition a new club   |
| GET    | `/api/clubs/:id`                           | Any                | Get club details      |
| PUT    | `/api/clubs/:id`                           | Admin              | Update club           |
| DELETE | `/api/clubs/:id`                           | Admin              | Delete club           |
| POST   | `/api/clubs/:id/approve`                   | Admin              | Approve club petition |
| POST   | `/api/clubs/:id/reject`                    | Admin              | Reject club petition  |
| POST   | `/api/clubs/:id/join`                      | Any                | Request to join club  |
| GET    | `/api/clubs/:id/members`                   | Any                | List club members     |
| POST   | `/api/clubs/:id/members/:memberId/approve` | Leader             | Approve join request  |
| POST   | `/api/clubs/:id/members/:memberId/reject`  | Leader             | Reject join request   |
| DELETE | `/api/clubs/:id/members/:memberId`         | Leader             | Remove member         |
| GET    | `/api/clubs/:id/posts`                     | Any                | List club posts       |
| POST   | `/api/clubs/:id/posts`                     | Leader             | Create post           |
| PUT    | `/api/clubs/:id/posts/:postId`             | Post owner         | Update post           |
| DELETE | `/api/clubs/:id/posts/:postId`             | Post owner / Admin | Delete post           |

### Events

| Method | Route                        | Access         | Description                               |
| ------ | ---------------------------- | -------------- | ----------------------------------------- |
| GET    | `/api/events`                | Any            | List all events (includes attendee_count) |
| POST   | `/api/events`                | Leader / Admin | Create event                              |
| GET    | `/api/events/:id`            | Any            | Get event details                         |
| PUT    | `/api/events/:id`            | Leader / Admin | Update event                              |
| DELETE | `/api/events/:id`            | Leader / Admin | Delete event                              |
| POST   | `/api/events/:id/register`   | Any            | Register for event                        |
| POST   | `/api/events/:id/unregister` | Any            | Unregister from event                     |
| GET    | `/api/events/:id/attendees`  | Any            | List event attendees                      |

### Users

| Method | Route            | Description        |
| ------ | ---------------- | ------------------ |
| GET    | `/api/users/:id` | Get user profile   |
| PUT    | `/api/users/:id` | Update own profile |

### Procurement

| Method | Route                          | Access          | Description            |
| ------ | ------------------------------ | --------------- | ---------------------- |
| GET    | `/api/procurement`             | Advisor / Admin | List all requests      |
| POST   | `/api/procurement`             | Leader          | Submit funding request |
| POST   | `/api/procurement/:id/approve` | Advisor / Admin | Approve request        |
| POST   | `/api/procurement/:id/reject`  | Advisor / Admin | Reject request         |

### Flags

| Method | Route                    | Access | Description    |
| ------ | ------------------------ | ------ | -------------- |
| GET    | `/api/flags`             | Admin  | List all flags |
| POST   | `/api/flags`             | Any    | Report content |
| PUT    | `/api/flags/:id/resolve` | Admin  | Resolve a flag |

---

## Database Schema

SQLite database stored at `server/database.db` (auto-created on first run).

| Table                  | Key Columns                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| `users`                | id, firstName, lastName, email, password (hashed), role                        |
| `clubs`                | id, name, description, category, mission, status, advisor_id                   |
| `club_memberships`     | id, club_id, user_id, role (leader/member), status (pending/approved/rejected) |
| `events`               | id, club_id, name, description, location, date, time, category, price          |
| `event_registrations`  | id, event_id, user_id                                                          |
| `posts`                | id, club_id, user_id, title, body, created_at                                  |
| `procurement_requests` | id, club_id, user_id, amount, description, status                              |
| `flag_reports`         | id, user_id, content_type, content_id, reason, status, created_at              |

---

## Key Design Decisions

- **SQLite** — simple, zero-config, file-based. Sufficient for a class project demo.
- **better-sqlite3** — synchronous SQLite driver; works well with Express's synchronous style.
- **JWT in localStorage** — straightforward for an SPA prototype. Token rehydrated on page refresh.
- **Vite proxy** — dev server forwards `/api/*` to Express on port 5000, avoiding CORS config.
- **No ORM** — raw SQL queries for clarity and simplicity.
- **Role enforcement** — done in each controller using `req.user.role` (set by the `authenticate` middleware).

---

## Known Limitations / Future Work

- Passwords are hashed with bcrypt but there is no password reset flow
- No email verification on registration
- Admin role must be assigned via direct API call (intentional — prevents self-promotion)
- Procurement request UI is backend-only; no frontend page yet
- No file upload support for club logos
- SQLite is not suitable for multi-instance production deployment
