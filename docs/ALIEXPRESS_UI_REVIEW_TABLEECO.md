# AliExpress-Style UI Review (TableEco)

Date: 2026-05-28

This review captures marketplace UX patterns inspired by AliExpress while keeping TableEco branding and implementation independent.

## What was implemented

- Replaced placeholder homepage content with a marketplace-style landing experience.
- Added a multi-block hero (primary campaign + two side campaigns).
- Added horizontal category shortcuts for quick navigation.
- Added flash-deals section with a live countdown timer and product cards.
- Added coupon center cards (collect, bundle, rewards).
- Added "Just For You" recommendation grid.
- Added trust/value strip (buyer protection, shipping, daily deals, secure payment, rewards).

## File changes

- `src/app/home/page.tsx`
- `src/components/home/MarketplaceHome.tsx`

## Next phase (recommended)

1. Bind homepage sections to real backend endpoints (deals, recommendations, coupons).
2. Add personalization based on browsing/cart history.
3. Add skeleton loaders and section-level error states.
4. Add analytics events for hero, coupon, and product clicks.
5. Add A/B variants for campaign and flash-deals ordering.
6. Improve accessibility: focus outlines, keyboard carousel behavior, and reduced-motion support.

## Notes

- The result follows general marketplace UX patterns and does not clone proprietary assets or exact layout implementation.
- Product imagery currently uses placeholder remote images and should be replaced with project-owned assets or API media.

