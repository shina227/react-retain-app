# Retain API

Base URL: `https://retain-api-dwgm.onrender.com/api` (local: `http://localhost:4000/api`) · JSON in, JSON out · Auth: `Authorization: Bearer <jwt>`

## Conventions

- **Money** is always an integer number of Rwandan francs (RWF has no subunit). `12550` = RWF 12,550.
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
| ✅ | GET | `/expenses` | user | List own expenses: search, filters, sort, pagination |
| ✅ | POST | `/expenses` | user | Create an expense |
| ✅ | GET | `/expenses/:id` | user | Get one own expense |
| ✅ | PUT | `/expenses/:id` | user | Replace an own expense |
| ✅ | DELETE | `/expenses/:id` | user | Delete an own expense |

**Expense object**

```json
{
  "id": "cm...",
  "title": "Groceries at Melcom",
  "amount": 12550,
  "date": "2026-09-05",
  "paymentMethod": "CASH",
  "notes": "weekly shop",
  "categoryId": "cm...",
  "category": { "id": "cm...", "name": "Food & Groceries", "color": "#16a34a" },
  "createdAt": "2026-10-10T09:00:00.000Z",
  "updatedAt": "2026-10-10T09:00:00.000Z"
}
```

**`POST /expenses`** (`201`) and **`PUT /expenses/:id`** (`200`) take the same body. `PUT` replaces the whole record, so leaving out `notes` clears it.

| Field | Rule |
|---|---|
| `title` | string, 1–100 chars (trimmed) |
| `amount` | integer francs, > 0, ≤ 1,000,000,000 |
| `categoryId` | must be an existing category (`400 INVALID_CATEGORY` otherwise) |
| `date` | `YYYY-MM-DD`, a real calendar date |
| `paymentMethod` | `CASH` · `CARD` · `MOBILE_MONEY` · `BANK_TRANSFER` |
| `notes` | optional string, ≤ 500 chars; empty or `null` stores `null` |

The owner always comes from the token. Any `userId` in the body is ignored.

**`GET /expenses/:id`**: `200` expense object. **`DELETE /expenses/:id`**: `204`, no body. Another user's expense returns `404` on get, update and delete.

**`GET /expenses`**: `200` `Paginated<Expense>`. All query params are optional, and empty values are ignored.

| Param | Meaning |
|---|---|
| `search` | case-insensitive match on `title` or `notes` |
| `categoryId`, `paymentMethod` | exact match |
| `startDate`, `endDate` | `YYYY-MM-DD`, both inclusive; `startDate > endDate` → 400 |
| `minAmount`, `maxAmount` | francs, both inclusive; `min > max` → 400 |
| `sortBy` | `date` (default) or `amount`; anything else → 400 |
| `sortOrder` | `desc` (default) or `asc`; ties broken by `createdAt`, then `id` |
| `page` | ≥ 1, default 1 |
| `limit` | ≥ 1, default 10, clamped to 50 |

Example: `GET /expenses?search=taxi&paymentMethod=MOBILE_MONEY&startDate=2026-10-01&endDate=2026-10-31&sortBy=amount&sortOrder=asc`

### Categories
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| ✅ | GET | `/categories` | user | All categories (for dropdowns) |
| ✅ | GET | `/admin/categories` | admin | Categories with usage counts |
| ✅ | POST | `/admin/categories` | admin | Create a category |
| ✅ | PUT | `/admin/categories/:id` | admin | Rename or recolor (the default can only be recolored) |
| ✅ | DELETE | `/admin/categories/:id` | admin | Delete; its expenses move to "Uncategorized" |

**`GET /categories`**: `200`, sorted by name.

```json
[{ "id": "cm...", "name": "Uncategorized", "color": "#94a3b8", "isDefault": true }]
```

**`GET /admin/categories`**: `200`. Same fields plus `createdAt` and `usageCount`. Categories with no expenses appear with `0`.

```json
[{ "id": "cm...", "name": "Transport", "color": "#0ea5e9", "isDefault": false, "createdAt": "...", "usageCount": 31 }]
```

**`POST /admin/categories`** (`201`) and **`PUT /admin/categories/:id`** (`200`) take the same body and return the category.

```json
{ "name": "Transport", "color": "#0EA5E9" }
```

`name` is 1–50 chars (trimmed) and must be unique ignoring case (`409 CATEGORY_EXISTS`). `color` is a 6-digit hex value, stored in lowercase. Renaming the default category returns `400 DEFAULT_CATEGORY`.

**`DELETE /admin/categories/:id`**: `200`. In one transaction, every expense in the category moves to the default "Uncategorized" category, then the category is deleted.

```json
{ "reassignedCount": 12 }
```

Errors: `400 DEFAULT_CATEGORY` (the default can't be deleted) · `404` (unknown id). All `/admin/*` routes return `403` for non-admin tokens.

### Budgets
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| ✅ | GET | `/budgets/:month` | user | Own budget for a month |
| ✅ | PUT | `/budgets/:month` | user | Set or update own budget for a month |

`:month` is `YYYY-MM` with a real month (`01`–`12`), otherwise `400`.

**`GET /budgets/:month`**: `200`. `amount` is `null` when no budget is set (not a 404).

```json
{ "month": "2026-10", "amount": 250000 }
```

**`PUT /budgets/:month`**: `200`, same shape. Creates the month's budget or replaces its amount (one budget per user per month).

```json
{ "amount": 250000 }
```

`amount` is integer francs, > 0, ≤ 1,000,000,000.

### Dashboard and insights
| | Method | Path | Auth | Description |
|---|---|---|---|---|
| ✅ | GET | `/dashboard?month=YYYY-MM` | user | Monthly summary: spent, budget, status, highest, by category, recent |
| ✅ | GET | `/admin/insights` | admin | Platform-wide insights |

**`GET /dashboard?month=YYYY-MM`**: `200`. `month` defaults to the current month (UTC). The month runs from the 1st (inclusive) to the 1st of the next month (exclusive).

```json
{
  "month": "2026-10",
  "totalSpent": 212000,
  "budget": 250000,
  "remaining": 38000,
  "percentUsed": 84.8,
  "status": "approaching",
  "highestExpense": { "...": "expense object" },
  "byCategory": [
    { "category": { "id": "cm...", "name": "Rent", "color": "#6366f1" }, "total": 120000, "count": 1 }
  ],
  "recent": [{ "...": "expense object" }]
}
```

| Field | Notes |
|---|---|
| `budget`, `remaining`, `percentUsed` | `null` when no budget is set. `remaining` goes negative when over budget. `percentUsed` has one decimal. |
| `status` | `within` (< 80%) · `approaching` (80–100%) · `over` (> 100%) · `none` (no budget) |
| `highestExpense` | the month's largest expense, or `null` |
| `byCategory` | only categories with spend this month, largest total first |
| `recent` | up to 5 of the month's expenses, newest date first |

**`GET /admin/insights`**: `200`. "Users" means role `USER` (admins are not counted).

```json
{
  "totalUsers": 5,
  "totalExpenses": 150,
  "totalValue": 4825000,
  "expensesThisMonth": 38,
  "spendPerCategory": [{ "id": "cm...", "name": "Rent", "color": "#6366f1", "count": 15, "total": 1800000 }],
  "top5": [{ "id": "cm...", "name": "Food", "color": "#16a34a", "count": 41, "total": 610000 }],
  "bottom5": [{ "id": "cm...", "name": "Gifts", "color": "#db2777", "count": 0, "total": 0 }],
  "recentExpenses": [{ "...": "expense object", "user": { "id": "cm...", "name": "Ama Mensah" } }],
  "recentUsers": [{ "id": "cm...", "name": "Ama Mensah", "email": "demo@example.com", "createdAt": "..." }]
}
```

| Field | Notes |
|---|---|
| `expensesThisMonth` | number of expenses dated in the current month |
| `spendPerCategory` | every category (including unused ones), largest total first |
| `top5` / `bottom5` | most / least used by expense count; `bottom5` includes zero-use categories, least used first; ties sorted by name |
| `recentExpenses` | 10 most recently added, across all users |
| `recentUsers` | 5 newest users; no password hashes |
