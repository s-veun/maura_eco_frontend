# User API Integration (Swagger-Driven)

This frontend service layer is intentionally restricted to **ROLE_USER-safe** endpoints.

## Endpoint Classification (from backend controllers + security config)

### Public / Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/refresh-token`
- `GET /oauth2/authorization/google` (server-driven OAuth2 redirect)

### User-Accessible (Integrated)
- `GET /api/v1/profile`
- `PUT /api/v1/profile/change-password`
- `GET /api/v1/orders/{userId}/history`
- `PUT /api/v1/orders/{orderId}/cancel`
- `GET /api/v1/cart/{userId}`
- `POST /api/v1/cart/{userId}/add`
- `GET /api/v1/wishlist`
- `POST /api/v1/wishlist/add/{productId}`
- `DELETE /api/v1/wishlist/remove/{productId}`
- `POST /api/v1/auth/logout`

### Admin-Only (Explicitly Excluded)
- `/api/v1/admin/**`
- `/api/v1/orders/by-status`
- `/api/v1/orders/count-by-status`
- `/api/v1/admin/orders/**`
- `/api/v1/admin/products/**`
- `/api/v1/admin/analytics/**`

## Guard Rails

- `src/services/http.ts` blocks known admin paths at runtime.
- `middleware.ts` blocks `/admin/*` for non-admin users.
- Dashboard integration uses only user service modules in this folder.

## Files

- `auth.service.ts`
- `profile.service.ts`
- `order.service.ts`
- `cart.service.ts`
- `wishlist.service.ts`
- `http.ts`

