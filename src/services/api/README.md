# Ecommerce API Integration

This folder provides production-ready API integration for the furniture ecommerce frontend.

## Stack

- `axios` for HTTP requests
- Axios interceptors for JWT injection and automatic token refresh
- `@tanstack/react-query` for caching, loading states, and mutation workflows

## Files

- `axios-client.ts`: Axios instances + interceptors + refresh token flow
- `ecommerce-api.ts`: Domain API methods (auth, products, cart, orders, wishlist, reviews)

## Query Hooks

Use `src/hooks/use-ecommerce-queries.ts` for ready-to-use React Query hooks.

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_AUTH_REFRESH_PATH` (default: `/auth/refresh-token`)
- `NEXT_PUBLIC_AUTH_LOGOUT_PATH` (default: `/auth/logout`)
- `NEXT_PUBLIC_AUTH_FORGOT_PASSWORD_PATH` (default: `/auth/forgot-password`)
- `NEXT_PUBLIC_AUTH_RESET_PASSWORD_PATH` (default: `/auth/reset-password`)

## Validation

```bash
npm run lint
npm run build
```

