# Finance Data Processing and Access Control Backend

A production-style Node.js backend for finance record management with role-based access control.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Zod validation

## Project Structure

```text
src/
  controllers/
  services/
  routes/
  middleware/
  utils/
  config/
  app.js

prisma/
  schema.prisma
```

## Setup Steps

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Update `.env` values, especially:
- `DATABASE_URL`
- `JWT_SECRET`

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run migration:

```bash
npm run prisma:migrate -- --name init
```

6. Start server:

```bash
npm run dev
```

Server runs at `http://localhost:4000` by default.

## Database Setup (PostgreSQL)

1. Create database:

```sql
CREATE DATABASE finance_db;
```

2. Set credentials in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_db?schema=public"
```

3. Run Prisma migrations (see setup section).

## API Base

No prefix is used; endpoints are mounted directly.

## Authentication

### Register
- `POST /auth/register`
- Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123"
}
```

### Login
- `POST /auth/login`
- Body:

```json
{
  "email": "john@example.com",
  "password": "StrongPass123"
}
```

Both return user object and JWT token.

Use token as:

```http
Authorization: Bearer <token>
```

## Users (Admin Only)

### Get Users
- `GET /users`

### Update User Status
- `PATCH /users/:id/status`
- Body:

```json
{
  "status": "INACTIVE"
}
```

## Records

### Create Record (Admin)
- `POST /records`
- Body:

```json
{
  "userId": "uuid",
  "amount": 1200.5,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-03-10T10:00:00.000Z",
  "note": "March salary"
}
```

### Get Records (All Roles)
- `GET /records`
- Query params:
- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `dateFrom` (ISO date)
- `dateTo` (ISO date)
- `category`
- `type` (`INCOME` or `EXPENSE`)

### Update Record (Admin)
- `PUT /records/:id`
- Body: any subset of create fields

### Delete Record (Admin)
- `DELETE /records/:id`

## Dashboard Summary

### Get Summary
- `GET /summary`
- Allowed roles: `ANALYST`, `ADMIN`
- Query params (optional):
- `dateFrom`
- `dateTo`

Returns:
- total income
- total expense
- net balance
- category-wise totals
- last 5 transactions
- monthly aggregation

## Role Explanation

- `VIEWER`: Read-only access to `GET /records`
- `ANALYST`: `GET /records` + `GET /summary`
- `ADMIN`: Full access (auth, users, records CRUD, summary)

## Response Format

Success:

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Assumptions

- Self-registration creates users with `VIEWER` role by default.
- Bootstrap of first admin user is done manually (DB seed or direct SQL update).
- Inactive users cannot authenticate or access protected endpoints.
- Record amount uses decimal precision at DB level (`Decimal(14,2)`).
