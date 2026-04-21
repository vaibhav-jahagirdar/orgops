# OrgOps

Multi-tenant project and access management system focused on authentication, data integrity, and concurrency-safe operations.

Built with Node.js, PostgreSQL, and Next.js as a backend-focused portfolio project.

---

## Stack

**Backend:** Node.js, Express, PostgreSQL  
**Frontend:** Next.js (App Router), TanStack Query, Zod, Tailwind  
**Auth:** JWT (15m access) + refresh token rotation  
**Validation:** Zod (client + server)

---

## Core Features

- Multi-tenant architecture with org-level data isolation  
- Role-based access control (Owner, Admin, Member)  
- Secure auth with refresh token rotation and replay detection  
- Ownership transfer with audit trail  
- Project and task management (assignment, priority, status)  
- Task comments with soft delete  
- Pagination, filtering, sorting on list endpoints  
- Audit logging on critical actions  

---

## Key Engineering Decisions

### Authentication
- Refresh tokens are rotated on every use  
- Replay detection via `replaced_by_token_id`  
- Token reuse triggers full session revocation  
- Tokens stored as SHA-256 hashes (no raw tokens)

### Concurrency
- SELECT FOR UPDATE used in token rotation and ownership transfer  
- Prevents race conditions under concurrent requests  

### Transactions
- Ownership transfer is atomic:
  - demote current owner  
  - promote new owner  
  - write audit log  
- All steps succeed or rollback  

### Data Integrity (DB-level)
- Single owner per org (partial unique index)  
- Unique user–org membership  
- Role constraint (CHECK)  
- Non-empty task titles (CHECK)

### Schema Design
- user_credentials separated from users  
- org_id denormalized on tasks and comments  
- Composite index (project_id, created_at DESC) for pagination  

---

## Schema Overview

\`\`\`
users
  └── user_credentials
  └── refresh_tokens
  └── membership
  └── orgs
        └── projects
              └── tasks
                    └── task_comments

audit_logs
\`\`\`

- Soft deletes on orgs and comments  
- assigned_to uses ON DELETE SET NULL

---

## Project Structure

\`\`\`
backend/
  controllers/
  services/
  middleware/
  routes/
  schemas/
  utils/

frontend/
  app/
  components/
  features/
  lib/
\`\`\`

---

## Demo

Live: https://orgops.vercel.app/

Email: rahul.verma13@gmail.com  
Password: simplepassword  

---

## Local Setup

**Requirements:** Node.js 18+, PostgreSQL 14+

\`\`\`bash
git clone https://github.com/vaibhav-jahagirdar/orgops
cd orgops
\`\`\`

### Backend

\`\`\`bash
cd backend
cp .env.example .env
npm install
psql -U postgres -f schema.sql
npm run dev
\`\`\`

### Frontend

\`\`\`bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
\`\`\`

### Env variables

\`\`\`
DATABASE_URL=
JWT_SECRET=
REFRESH_TOKEN_DAYS=7
\`\`\`

---

## Tests

\`\`\`bash
cd backend
npm test
\`\`\`

Covers auth flows including token rotation and replay detection.

---

## Limitations

- No email verification  
- Audit logs limited to org-level actions  
- No rate limiting on auth endpoints  
- Partial frontend error handling  

---

## Author

Vaibhav Jahagirdar  
GitHub: https://github.com/vaibhav-jahagirdar
