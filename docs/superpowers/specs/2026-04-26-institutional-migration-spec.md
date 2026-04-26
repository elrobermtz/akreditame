# Design Spec: Institutional Migration (Akredita me)

**Date:** 2026-04-26
**Status:** Approved design direction

## 1. Goal
Refactor the Akredita me website into a highly professional, institutional platform using Tailwind CSS and Vite. The aesthetics must project authority ("Old Money"), transparency, and "Minimalismo Premium".

## 2. Technical Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (Utility-first)
- **Icons:** Lucide React (1.5px stroke weight)
- **Animations:** Framer Motion (Heavy, smooth transitions)

## 3. Design System (Tailwind Config)
- **Colors:**
  - `akredita-dark`: `#0B1F3A` (Primary Background/Headers)
  - `akredita-blue`: `#009BFF` (Accents/Accented description markers)
  - `akredita-blue-dark`: `#0052CC` (Gradient secondary)
  - `akredita-orange`: `#FF6A00` (ACTION ONLY)
  - `akredita-orange-dark`: `#E53900` (Hover action)
  - `akredita-bg`: `#F9FAFB` (Light surface)
- **Typography:** 'Inter Tight' (Sans-serif)
- **Shadows:** Custom "Premium" soft shadows for cards.

## 4. Component Breakdown

### A. Navigation (Fixed)
- **Background:** Transparent transitioning to solid `akredita-dark`.
- **Logo:** `wordmark-v4.png` (White text version).
- **Links:** Upper-case, 0.9rem, high letter-spacing.

### B. Hero Section (Vanguardia Dynamic)
- **Background:** Deep navy (`akredita-dark`) with atmospheric light blue radial glow (`rgba(0,155,255,0.15)`).
- **Typography:** Pure White title, bold weight (700), tight line height (1.1).
- **Description:** 1.25rem, opacity 0.8, with a left accent border in `akredita-blue`.
- **CTAs:**
  - Primary: `akredita-orange`.
  - Secondary: Glassmorphism (`blur`, semi-transparent border).

### C. Verticals Section
- **Grid:** Responsive (1 col mobile, 3 col desktop).
- **Card Design:** 
  - Energy vertical: Solid, shadow-heavy, reliable.
  - Innovation vertical: Glassmorphism, modern, tech-forward.
- **Accents:** Use `akredita-blue` for iconography.

### D. Lead Wizard
- **Layout:** Centered card, minimalist inputs.
- **Progress:** Subtle bar at the top in `akredita-blue`.

## 5. Mobile First Strategy
- Use `sm:` prefix for all layout changes.
- Padding should "breathe" more on mobile (min 1.5rem padding).
- Typography should use `clamp()` or Tailwind `text-3xl sm:text-5xl`.

## 6. Verification
- Pixel-perfect match with the approved V3 mockup.
- Verified contrast ratios for accessibility.
