# TaskFlow — Modern SaaS Task Tracker Web Application

TaskFlow is a production-quality, responsive Task Tracker web application built with a modern SaaS productivity aesthetic. It features session-based authentication, role-based access control (RBAC), strict ownership enforcement, and in-memory persistence.

---

## 1. Project Overview

TaskFlow enables registered users to organize their daily deliverables across three lifecycle states (`todo`, `in_progress`, and `done`). Standard users operate in isolated workspaces where they can view, create, edit, and delete only their own tasks. Administrators possess central governance capabilities: viewing system-wide tasks grouped by owner, editing any user's task, deleting any user's task, and monitoring aggregate platform metrics.

### Key Highlights
- **SaaS Design System**: Clean slate-50 / blue-600 foundation, Inter typography, Lucide React iconography, rounded cards, and responsive layouts.
- **Enterprise-Grade Security**: Session cookies with `HttpOnly` and `SameSite` flags, cryptographic `bcrypt` password hashing, and server-side RBAC checks.
- **Strict Data Isolation**: Unauthenticated access returns `401 Unauthorized`; attempts to access, modify, or delete another user's task return `404 Not Found` to prevent ID enumeration.
- **Automated Test Coverage**: Comprehensive test suite with Jest and Supertest covering authentication, ownership isolation, permissions, and input validation.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6 (with `ProtectedRoute` redirects)
- **API Client**: Axios (`withCredentials: true`)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express.js
- **Authentication**: `express-session` (cookie-based session management)
- **Password Hashing**: `bcryptjs` (salt rounds: 10)
- **CORS**: Configured with origins and credentials enabled
- **Storage**: In-memory JavaScript data store with pre-seeded users and tasks

### Testing
- **Test Runner**: Jest
- **Integration Testing**: Supertest

---

## 3. Demo Credentials

The backend initializes an in-memory data store seeded with actual bcrypt hashes for local evaluation:

| Role | Username | Password | Purpose |
|---|---|---|---|
| **Admin** | `admin` | `Admin@123` | Full access to all users' tasks, grouped views, and system statistics |
| **User** | `piyush` | `User@123` | Standard user workspace (seeded with 3 tasks across all statuses) |
| **User** | `rahul` | `User@123` | Standard user workspace (seeded with 3 tasks across all statuses) |
| **User** | `amit` | `User@123` | Standard user workspace (seeded with 2 tasks) |

---

## 4. Project Folder Structure

```text
TaskFlow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── session.js             # express-session configuration (httpOnly, sameSite)
│   │   ├── controllers/
│   │   │   ├── authController.js       # Login, logout, /api/me handlers
│   │   │   └── taskController.js       # Task CRUD & aggregate stats handlers
│   │   ├── data/
│   │   │   ├── seed.js                 # Initial users with bcrypt hashes & sample tasks
│   │   │   └── store.js                # In-memory data store with atomic operations
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # Validates session; returns 401 if unauthenticated
│   │   │   ├── roleMiddleware.js       # Enforces 'admin' role privileges
│   │   │   └── errorHandler.js         # Global JSON error formatting
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # Auth endpoint router
│   │   │   └── taskRoutes.js           # Task endpoint router with middleware guards
│   │   ├── services/
│   │   │   └── taskService.js          # Business logic, ownership checks, and queries
│   │   ├── validators/
│   │   │   └── taskValidator.js        # Input validation for task title, desc, status
│   │   ├── app.js                      # Express application setup, CORS, session, routes
│   │   └── server.js                   # Server bootstrap listener on port 5000
│   ├── tests/
│   │   ├── auth.test.js                # Auth integration test suite (Jest & Supertest)
│   │   └── tasks.test.js               # Tasks & RBAC integration test suite
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx       # Modal for delete confirmation
│   │   │   ├── Navbar.jsx              # Responsive public navigation header
│   │   │   ├── ProtectedRoute.jsx      # Route guard with role-based redirects
│   │   │   ├── Sidebar.jsx             # Collapsible dashboard sidebar
│   │   │   ├── StatCard.jsx            # Metric summary card
│   │   │   ├── StatusBadge.jsx         # Status pills (To Do, In Progress, Done)
│   │   │   ├── TaskCard.jsx            # Reusable task card with quick status switcher
│   │   │   └── TaskModal.jsx           # Task creation and editing dialog
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global session state & auth methods
│   │   ├── hooks/
│   │   │   └── useAuth.js              # Auth context consumer hook
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx      # Admin view with grouped tasks and system stats
│   │   │   ├── Home.jsx                # Public landing page
│   │   │   ├── Login.jsx               # Dedicated login page with demo account helper
│   │   │   ├── NotFound.jsx            # 404 error page
│   │   │   └── UserDashboard.jsx       # Standard user workspace
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with withCredentials: true
│   │   ├── App.jsx                     # Application routing definitions
│   │   ├── index.css                   # Tailwind imports and base styles
│   │   └── main.jsx                    # React entrypoint
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
├── package.json                        # Root scripts for concurrently running or testing
└── README.md
```

---

## 5. Installation & Setup Instructions

Follow these commands to install dependencies, run tests, and start the application:

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

*(Alternatively, from the project root you can run: `npm run install:all`)*

---

## 6. Running the Application

Open two terminal windows:

### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
```
> The backend server starts at **`http://localhost:5000`**.

### Terminal 2: Start Frontend Application
```bash
cd frontend
npm run dev
```
> The Vite development server starts at **`http://localhost:5173`**.

Open your browser and navigate to **`http://localhost:5173`**.

---

## 7. Running Automated Tests

The test suite covers session management, user isolation, administrator privilege escalation, input validation, and HTTP status code compliance.

To execute the test suite:
```bash
cd backend
npm test
```

### Test Coverage Highlights:
- **Authentication (`auth.test.js`)**:
  - `POST /api/login` with valid user credentials (returns 200, user data, and cookie)
  - `POST /api/login` with valid admin credentials
  - `POST /api/login` with invalid username (returns 401)
  - `POST /api/login` with incorrect password (returns 401)
  - `POST /api/login` with missing payload (returns 401)
  - `GET /api/me` unauthenticated (returns 401)
  - `GET /api/me` authenticated session persistence (returns 200)
  - `POST /api/logout` destroys session and revokes access to protected routes
- **Tasks & Authorization (`tasks.test.js`)**:
  - Unauthenticated requests to `/api/tasks` return 401
  - User can view only their own tasks (Rahul's tasks do not leak to Piyush)
  - User can create tasks; backend strictly enforces initial status as `todo`
  - User can update and delete their own tasks
  - User attempting to update or delete another user's task receives **404 Not Found** (preventing ID enumeration)
  - Admin can view all tasks across all users with owner metadata attached
  - Admin can update or delete any user's task
  - Validation: rejects missing title, title < 3 chars, title > 100 chars, description > 500 chars, invalid statuses, and empty update payloads (all return 400)
  - Aggregate statistics endpoint returns correct counts for users and admins

---

## 8. REST API Reference

All protected endpoints require an active session cookie (`taskflow.sid`).

### Authentication Endpoints

#### 1. User Login
- **Endpoint**: `POST /api/login`
- **Body**:
  ```json
  {
    "username": "piyush",
    "password": "User@123"
  }
  ```
- **Success (200)**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "user-piyush-002",
      "username": "piyush",
      "role": "user",
      "name": "Piyush Sharma"
    }
  }
  ```
- **Error (401)**: `{"error": "Invalid username or password"}`

#### 2. User Logout
- **Endpoint**: `POST /api/logout`
- **Success (200)**: `{"message": "Logged out successfully"}`

#### 3. Current User Profile
- **Endpoint**: `GET /api/me`
- **Success (200)**: Returns user object.
- **Error (401)**: `{"error": "Unauthenticated"}`

---

### Task Endpoints

#### 4. List Tasks
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `status` (optional): `todo` | `in_progress` | `done`
- **Behavior**:
  - Standard user receives only their own tasks.
  - Admin receives all tasks across the platform with `owner` metadata (`{ id, username, name }`).
- **Success (200)**: Array of tasks.

#### 5. Create Task
- **Endpoint**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "title": "Complete documentation",
    "description": "Prepare project README"
  }
  ```
- **Validation**:
  - `title`: required, trimmed, 3–100 characters.
  - `description`: optional, max 500 characters.
  - `status`: Always initialized to `todo` by backend regardless of payload.
- **Success (201)**: Returns created task.
- **Error (400)**: Input validation failure.

#### 6. Update Task
- **Endpoint**: `PATCH /api/tasks/:id`
- **Body**: Any combination of `title`, `description`, or `status`.
- **Authorization**:
  - Standard user can only update their own task.
  - Admin can update any task.
- **Success (200)**: Returns updated task.
- **Error (400)**: Empty payload or validation error.
- **Error (404)**: Task does not exist or belongs to another user.

#### 7. Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Authorization**:
  - Standard user can only delete their own task.
  - Admin can delete any task.
- **Success (204)**: No content.
- **Error (404)**: Task does not exist or belongs to another user.

#### 8. Aggregate Statistics
- **Endpoint**: `GET /api/tasks/stats`
- **Success (200)**:
  - Standard user: `{"total": 3, "todo": 1, "in_progress": 1, "done": 1}`
  - Admin: `{"total": 8, "todo": 2, "in_progress": 3, "done": 3, "totalUsers": 3}`

---

## 9. Security & Access Control Matrix

| Action | Unauthenticated | Standard User | Administrator |
|---|---|---|---|
| Access Public Homepage (`/`) | Allowed | Allowed | Allowed |
| Sign In (`POST /api/login`) | Allowed | Allowed | Allowed |
| Access Dashboard (`/dashboard`) | Redirected to `/login` | Allowed | Redirected to `/admin` |
| Access Admin Panel (`/admin`) | Redirected to `/login` | Redirected to `/dashboard` | Allowed |
| Read Own Tasks | 401 Unauthorized | Allowed | Allowed |
| Read Other User's Tasks | 401 Unauthorized | Filtered out | Allowed (with owner details) |
| Update Own Task | 401 Unauthorized | Allowed | Allowed |
| Update Other User's Task | 401 Unauthorized | **404 Not Found** | Allowed |
| Delete Own Task | 401 Unauthorized | Allowed | Allowed |
| Delete Other User's Task | 401 Unauthorized | **404 Not Found** | Allowed |

---

## 10. Design System & UI/UX Standards

The application strictly implements the blue-and-white SaaS design system:
- **Primary Color**: `#2563EB` (Tailwind `blue-600`)
- **Primary Hover**: `#1D4ED8` (Tailwind `blue-700`)
- **Background**: `#F8FAFC` (Tailwind `slate-50`)
- **Cards**: `#FFFFFF` with subtle slate borders and drop shadows
- **Typography**: Inter sans-serif with distinct weight hierarchies
- **States**:
  - Loading skeletons / spinner overlays
  - Empty states with call-to-action buttons
  - Form field character counters (`title: /100`, `description: /500`)
  - Deletion confirmation dialogs
  - Quick inline status transition selectors

---

## 11. Known Limitations & Architectural Notes

1. **In-Memory Storage**: Data persists in server memory for the duration of the server process. Restarting the backend server resets all records back to the initial seed state.
2. **Session Storage**: In-memory `MemoryStore` is utilized for `express-session` as specified. For multi-instance horizontal scaling in production, this can be swapped with Redis or an encrypted cookie store.

