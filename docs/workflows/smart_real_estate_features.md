---
description: Implementation plan for Smart Real Estate Features including Smart Search, Badges, Seller Dashboard, and Performance upgrades.
---

# Smart Real Estate Features Implementation

This workflow outlines the steps to implement the "World-Class" feature set requested.

## 1. Smart Search Bar (UI/UX)
- [ ] Create `src/app/components/SmartSearchBar.tsx`.
  - Design a large, inviting text area with the placeholder "Describe your dream home...".
  - tailored for `PremiumHero` replacement or overlay.
- [ ] Implement `parseSearchQuery(text)` mock service.
  - Create a utility function that extracts keywords (e.g., "pool", "3 beds", "modern") from natural language.
  - Return a structured filter object compatible with `useProperties` hook.
- [ ] Integrate into `PremiumHero.tsx`.
  - Replace the current inputs with the new `SmartSearchBar`.

## 2. Listing Card "Badges"
- [ ] Define Badge Logic.
  - "Great Investment": Calculate if `pricePerSqFt < 300` (or dynamic market average).
  - "Top School District": Mock check or random assignment for demo `rating > 8`.
  - "Commuter Friendly": Mock check.
- [ ] Update `src/app/components/PropertyCard.tsx`.
  - Add visual badges to the top-left or overlay area (ensuring no clash with "Compare" checkbox).
  - Use distinct colors (Purple for Investment, Blue for School, Amber for Commute).

## 3. Seller Dashboard
- [ ] Create `src/app/pages/customer/SellerDashboard.tsx`.
  - Layout: Sidebar navigation + Main Content area.
- [ ] Implement Views Chart.
  - Use `recharts` to display "Daily Views".
- [ ] Implement Feedback List.
  - Create a mock data list of feedback items from showings.
- [ ] Update Router in `App.tsx`.
  - Add protected route `/seller/dashboard`.

## 4. Performance Updates
- [ ] Infinite Scroll Implementation.
  - Create `src/hooks/useInfiniteScroll.ts`.
  - Refactor `BuyListing.tsx` and `RentListing.tsx` to append properties instead of replacing them.
- [ ] Image Optimization (Vite Alternative).
  - Ensure all `img` tags have `loading="lazy"`.
  - Implement a `Picture` component or wrapper that handles multiple sizes if source sets are available (or standard optimization attributes).
