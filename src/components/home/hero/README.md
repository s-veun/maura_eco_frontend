# Premium Hero Section

Reusable premium ecommerce hero section for `table_eco_table_frontend`.

## Features

- API-driven slide data using React Query (`useHeroSlides`)
- Swiper slider with `Autoplay`, `Pagination`, `Navigation`, `EffectFade`, and touch swipe
- Framer Motion transitions for text blocks, CTA area, stats cards, and image parallax
- Skeleton loading state while fetching banners
- Responsive layout optimized for mobile, tablet, and desktop
- Rounded corners fixed at `5px`

## Files

- `PremiumHeroSection.tsx` - main Swiper hero component
- `HeroSlideContent.tsx` - reusable content block with tags/CTA/stats
- `HeroSkeleton.tsx` - loading UI
- `useHeroSlides.ts` - API + fallback data hook
- `fallback-data.ts` - local fallback slides
- `types.ts` - hero types

