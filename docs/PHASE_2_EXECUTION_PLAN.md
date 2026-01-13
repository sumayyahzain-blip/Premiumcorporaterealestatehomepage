# Phase 2 Execution Plan: Database & API Integration
**Project:** Grade A Realty  
**Phase:** 2 (Backend Integration)  
**Status:** Active Development


---

## 1. Executive Summary
The goal of Phase 2 is to replace the static "Mock Data" layer of the Phase 1 MVP with a fully functional, database-backed API. This ensures data persistence for Users, Properties, and Transactions.

**Core Technology Stack:**
*   **Database:** PostgreSQL (Schema defined in `server/db.ts` or `database/` migration files)
*   **API:** Node.js + Express (located in `server/` or `src/api`)
*   **Frontend Data Layer:** React Query / Axios (replacing hardcoded JSON)

---

## 2. Scope of Work

### What Will Change (Active Dev):
1.  **`src/services/*`**: All mock services returning static arrays will be rewritten to make HTTP REST calls.
2.  **`src/store/*`**: State management will update to handle `loading`, `error`, and `success` states from async API calls.
3.  **Authentication**: The current "simulated" login will be replaced with real JWT-based authentication endpoints (`POST /api/auth/login`).
4.  **Forms**: `CreatePropertyPage` and `RegisterPage` will submit actual data to the backend.

### What Remains Untouched (Stable):
1.  **UI/UX Design**: The "Premium" aesthetics (colors, fonts, layout) approved in Phase 1.
2.  **Routing Structure**: The paths (`/`, `/dashboard`, `/admin`) remain identical; only the data *inside* them becomes dynamic.
3.  **Component Library**: Generic UI components (Buttons, Inputs, Cards) will not be refactored.

---

## 3. Milestones & Checkpoints

### Milestone 1: Foundation & Connectivity
*   **Task**: Verify PostgreSQL connection and schema integrity.
*   **Task**: Ensure the Express server runs concurrently with Vite.
*   **Deliverable**: `/api/health` endpoint returning `200 OK` and DB Connection confirmed.

### Milestone 2: Authentication System
*   **Task**: Implement `POST /auth/register` and `POST /auth/login`.
*   **Task**: Update `AuthProvider.tsx` to persist sessions.
*   **Checkpoint**: User can register a new account and persist login after refresh. (Mock users will be purged).

### Milestone 3: User Management (Admin)
*   **Task**: Implement `GET /api/users` and `PATCH /api/users/:id`.
*   **Task**: Connect the new `UsersPage.tsx` to live data.
*   **Checkpoint**: Admin can see real registered users in the dashboard table.

### Milestone 4: Property Engine
*   **Task**: Implement CRUD endpoints for Properties (`GET`, `POST`, `PUT`, `DELETE`).
*   **Task**: Connect `CreatePropertyPage` form to backend.
*   **Task**: Connect Homepage "Featured Listings" to real DB query.
*   **Checkpoint**: A property created in the Dashboard appears on the Homepage immediately.

---

## 4. Risk Mitigation
*   **Data Migration**: Since Phase 1 data is mock, no migration is needed. The DB will start fresh.
*   **Architecture**: We will introduce a strict "Adapter Pattern" in `src/services` to minimize impact on UI components if API signatures change.

---

## 5. Approval to Proceed
*   [ ] Approve Phase 2 Scope
*   [ ] Confirm Database Credentials are available (Environment Variables)
