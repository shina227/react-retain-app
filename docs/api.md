# Retain API

Base URL: `{API_URL}/api` · JSON in, JSON out · Auth: `Authorization: Bearer <jwt>`

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
| | POST | `/auth/register` | public | Create an account (always role `USER`) |
| | POST | `/auth/login` | public | Exchange credentials for a JWT |
| | GET | `/auth/me` | user | Current user |

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
