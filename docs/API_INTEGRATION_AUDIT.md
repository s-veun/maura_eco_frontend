# API Integration Audit (May 2026)

This document maps `demo_project_spring_boot` public ecommerce APIs to `table_eco_table_frontend` and explicitly excludes admin/internal routes.

## Public APIs approved for frontend ecommerce

### Products
- `GET /api/v1/products`
- `GET /api/v1/products/{proId}`
- `GET /api/v1/products/search?keyword=...`
- `GET /api/v1/products/new-arrivals`
- `GET /api/v1/products/new-arrivals/paginated?page=&limit=`
- `GET /api/v1/products/popular/trending?limit=`
- `GET /api/v1/products/popular/most-viewed?limit=`
- `GET /api/v1/products/popular/most-purchased?limit=`
- `GET /api/v1/products/popular/top-rated?limit=`

### Search / Filtering
- `GET /api/v1/search/products?keyword=&categoryId=&brand=&minPrice=&maxPrice=&available=&minRating=&sortBy=&sortDirection=&page=&size=`
- `GET /api/v1/search/suggestions?query=&limit=`
- `GET /api/v1/search/filters?keyword=&categoryId=`
- `GET /api/v1/search/by-tags?tags=a&tags=b`

### Categories
- `GET /api/v1/categories`
- `GET /api/v1/categories/{id}`

### Banners
- `GET /api/v1/banners`
- `GET /api/v1/banners/{id}`

### Popularity / Recommendations
- `POST /api/v1/popularity/view/{productId}`
- `GET /api/v1/popularity/most-viewed?limit=`
- `GET /api/v1/popularity/most-purchased?limit=`
- `GET /api/v1/popularity/top-rated?limit=`
- `GET /api/v1/popularity/trending?limit=`
- `GET /api/v1/popularity/user/recommendations?limit=` (auth)
- `GET /api/v1/popularity/user/recently-viewed?limit=` (auth)

### Wishlist (auth)
- `GET /api/v1/wishlist`
- `POST /api/v1/wishlist/add/{productId}`
- `DELETE /api/v1/wishlist/remove/{productId}`
- `GET /api/v1/wishlist/check/{productId}`
- `DELETE /api/v1/wishlist/clear`

### Cart (auth)
- `GET /api/v1/cart/{userId}`
- `POST /api/v1/cart/{userId}/add?productId=&quantity=`
- `PUT /api/v1/cart/{userId}/update?productId=&quantity=`
- `DELETE /api/v1/cart/{userId}/remove/{productId}`
- `DELETE /api/v1/cart/{userId}/clear`

### Orders (auth)
- `POST /api/v1/orders/checkout`
- `GET /api/v1/orders/{userId}/history`
- `PUT /api/v1/orders/{orderId}/cancel`
- `GET /api/v1/orders/{orderId}/tracking`
- `GET /api/v1/orders/{orderId}/status-history`
- `GET /api/v1/orders/{orderId}/latest-status`
- `GET /api/v1/orders/statuses`

### Reviews
- `GET /api/v1/reviews/product/{productId}`
- `POST /api/v1/reviews/add` (auth)
- `DELETE /api/v1/reviews/{reviewId}` (auth)
- `POST /api/v1/reviews/{reviewId}/vote?helpful=true|false` (auth)
- `GET /api/v1/reviews/{reviewId}/votes`

### Auth / Profile
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/profile` (auth)
- `PUT /api/v1/users/profile` (auth)
- `PUT /api/v1/users/profile/change-password` (auth)
- `PUT /api/v1/users/profile/image` (auth, multipart)
- `DELETE /api/v1/users/profile/image` (auth)
- `GET/POST/PUT/DELETE /api/v1/users/profile/addresses...` (auth)
- `PUT /api/v1/users/profile/settings` (auth)

### Coupons
- `GET /api/v1/coupons/validate?code=`

## Explicitly blocked from ecommerce frontend
- `/api/v1/admin/**`
- `/api/v1/dashboard/**`
- `/api/v1/manage/**`
- `/api/v1/orders/by-status`
- `/api/v1/orders/count-by-status`
- `/api/v1/orders/{id}/status` (admin status mutation)
- `/api/v1/banners/admin/**`
- `/api/v1/banners/positions`
- `/api/v1/system/**`

## Response shape notes
- Product lists return either plain arrays or wrappers (`products`, `data`, `content`)
- Search returns page metadata (`currentPage`, `totalItems`, `totalPages`, `pageSize`)
- Some endpoints wrap payload under `data` with `{ success, message }`
- Error payloads vary (`message`, `error`, plain text)

## Frontend alignment implemented
- Centralized endpoint map: `src/lib/endpoints.ts`
- Public route guard added for service layer calls (admin/internal routes blocked)
- New typed service modules:
  - `src/services/product.service.ts`
  - `src/services/category.service.ts`
  - `src/services/review.service.ts`
- New type modules:
  - `src/types/product.types.ts`
  - `src/types/category.types.ts`
  - `src/types/auth.types.ts`
  - `src/types/order.types.ts`
  - `src/types/review.types.ts`

