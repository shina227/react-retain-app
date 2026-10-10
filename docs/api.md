# Retain API

Base URL: `https://retain-api-dwgm.onrender.com/api` (local: `http://localhost:4000/api`) · JSON in, JSON out · Auth: `Authorization: Bearer <jwt>`

## Conventions

- **Money** is always an integer in minor units (pesewas). `12550` = GHS 125.50.
- **Dates** (`Expense.date`) are `YYYY-MM-DD`. **Months** are `YYYY-MM`.
- **Timestamps** (`createdAt`, `updatedAt`) are ISO 8601.
- **Auth levels:** `public` · `user` (any signed-in user) · `admin` (role `ADMIN`).
- **Ownership:** expenses and budgets are always scoped to the signed-in user. Another user's resource returns `404`.

### Paginated responses

```json
{ "data": [], "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
```

`limit` defaults to 10 and is clamped to a maximum of 50.

### Errors

Every error uses the same shape:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": { "amount": ["Amount must be greater than 0"] }
  }
}
```

| Status | When |
|---|---|
| 400 | Validation failed, malformed JSON, invalid operation |
| 401 | Missing, invalid or expired token; wrong credentials |
| 403 | Signed in, but not an admin |
| 404 | Resource doesn't exist or isn't yours; unknown route |
| 409 | Unique conflict (e.g. email or category name already exists) |
| 429 | Too many login/register attempts (10 per 15 min per IP) |
| 500 | Unexpected server error |

## Endpoints

Shapes are filled in as each endpoint is built. ✅ = implemented.

### Health
| ✅ | Method | Path | Auth | Description |
|---|---|---|---|---|
| ✅ | GET | `/health` | public | API and database status |

### Auth
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| ✅ | POST | `/auth/register` | public | Create an account (always role `USER`) |
| ✅ | POST | `/auth/login` | public | Exchange credentials for a JWT |
| ✅ | GET | `/auth/me` | user | Current user |

**`POST /auth/register`**: `201`

```json
// request: email is trimmed and lowercased; password 8–72 chars; any `role` field is ignored
{ "name": "Ama Mensah", "email": "ama@example.com", "password": "password123" }
// response
{
  "token": "<jwt>",
  "user": { "id": "cm...", "name": "Ama Mensah", "email": "ama@example.com", "role": "USER", "createdAt": "2026-10-09T10:00:00.000Z" }
}
```

Errors: `400 VALIDATION_ERROR` · `409 EMAIL_TAKEN` · `429 RATE_LIMITED`

**`POST /auth/login`**: `200`, same response shape as register.

```json
{ "email": "ama@example.com", "password": "password123" }
```

Errors: `400 VALIDATION_ERROR` · `401 INVALID_CREDENTIALS` (same message, "Invalid email or password", for an unknown email and a wrong password) · `429 RATE_LIMITED`

**`GET /auth/me`**: `200`

```json
{ "user": { "id": "cm...", "name": "Ama Mensah", "email": "ama@example.com", "role": "USER", "createdAt": "..." } }
```

Errors: `401 UNAUTHORIZED` (no `Bearer` header) · `401 INVALID_TOKEN` (bad signature, malformed or expired)

**Token:** HS256 JWT with payload `{ sub: userId, role, iat, exp }`, valid for 7 days. Admin routes return `403 FORBIDDEN` for a valid non-admin token.

### Expenses
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| | GET | `/expenses` | user | List own expenses: search, filters, sort, pagination |
| | POST | `/expenses` | user | Create an expense |
| | GET | `/expenses/:id` | user | Get one own expense |
| | PUT | `/expenses/:id` | user | Update an own expense |
| | DELETE | `/expenses/:id` | user | Delete an own expense |

### Categories
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| | GET | `/categories` | user | All categories (for dropdowns) |
| | GET | `/admin/categories` | admin | Categories with usage counts |
| | POST | `/admin/categories` | admin | Create a category |
| | PUT | `/admin/categories/:id` | admin | Rename or recolor (not the default) |
| | DELETE | `/admin/categories/:id` | admin | Delete; its expenses move to "Uncategorized" |

### Budgets
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| | GET | `/budgets/:month` | user | Own budget for a month |
| | PUT | `/budgets/:month` | user | Set or update own budget for a month |

### Dashboard and insights
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| | GET | `/dashboard?month=YYYY-MM` | user | Monthly summary: spent, budget, status, highest, by category, recent |
| | GET | `/admin/insights` | admin | Platform-wide insights |
