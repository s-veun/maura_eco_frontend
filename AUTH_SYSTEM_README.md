# Frontend Authentication System (Fetch API)

This project now includes a complete authentication flow using **Fetch API** for a Spring Boot 3 + Spring Security 6 + JWT + OAuth2 backend.

## Included Features

- Username/email + password login (`POST /api/v1/auth/login`)
- Google OAuth login (`/oauth2/authorization/google`)
- OAuth callback handling (`/auth/callback`)
- Access token + refresh token handling
- Session remember-me behavior (localStorage or sessionStorage)
- Cookie hint (`te_access_token`) for middleware route protection
- Protected routes (`/dashboard`, `/profile`)
- Middleware redirects for unauthenticated and authenticated users
- Logout flow with backend request + local cleanup
- Loading and error states
- Toast notifications
- Role-aware protected component support

## Folder Structure

- `src/auth/types.ts`
- `src/auth/token-store.ts`
- `src/auth/auth-service.ts`
- `src/auth/AuthProvider.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/ui/toast-provider.tsx`
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/auth/callback/page.tsx`
- `middleware.ts`

## Environment Variables

Add these values to `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.up.railway.app/api/v1
NEXT_PUBLIC_BACKEND_ORIGIN=https://your-backend.up.railway.app
NEXT_PUBLIC_AUTH_LOGIN_PATH=/auth/login
NEXT_PUBLIC_AUTH_REGISTER_PATH=/auth/register
NEXT_PUBLIC_AUTH_REFRESH_PATH=/auth/refresh
NEXT_PUBLIC_AUTH_LOGOUT_PATH=/auth/logout
NEXT_PUBLIC_OAUTH_GOOGLE_PATH=/oauth2/authorization/google
```

`NEXT_PUBLIC_BACKEND_ORIGIN` is optional but recommended in production to keep OAuth redirect targets explicit.

If your backend redirects OAuth response to frontend with query tokens, configure the backend redirect URL to:

```text
https://your-frontend-domain/auth/callback
```

The Google button on `/login` redirects directly to the backend OAuth endpoint and relies on backend property
`OAUTH2_AUTHORIZED_REDIRECT_URI` to send users back to `/auth/callback`.

## API Integration Notes

### Login Request Example (Fetch API)

```ts
await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ username: "admin", password: "123456" }),
});
```

### Refresh Flow

When API responds with `401`, the client calls `/auth/refresh` using the stored refresh token and retries the failed request.

## Railway + CORS Checklist

On backend, ensure CORS allows your frontend origin and credentials:

- `Access-Control-Allow-Origin: https://your-frontend-domain`
- `Access-Control-Allow-Credentials: true`
- allowed methods include `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- allowed headers include `Authorization, Content-Type`

## Smoke Test Script

A simple runner validates login + refresh flow:

```bash
AUTH_SMOKE_USERNAME=admin AUTH_SMOKE_PASSWORD=123456 npm run auth:smoke
```

## Run Locally

```bash
npm install
npm run dev
```

Open:

- `/login`
- `/register`
- `/dashboard`
- `/profile`

## Security Notes

- For strongest security in production, prefer **HttpOnly secure cookies** managed by backend.
- This implementation also stores tokens in browser storage to support bearer token APIs and middleware hints.
- Role checks are available via `ProtectedRoute` (`roles` prop).

