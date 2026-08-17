# Mobile UI Revamp Implementation Plan

## Goal
Transform the currently unpolished mobile view of the RST Style Studio LK application into a "perfect, creative, attractive, and modern" UI. Crucially, these changes will exclusively target mobile viewports using Tailwind's responsive prefixes (like `md:` and `lg:`), ensuring the existing desktop layouts and designs remain completely unchanged.

## Overview of Changes

1. **Mobile Navigation (Navbar)**
   - Transform the basic full-screen overlay into a sleek, sliding off-canvas glassmorphic drawer.
   - Add entry animations for menu items so they stagger in when opened.
   - Refine the mobile toggle button placement and appearance.
   - Ensure the DJ chassis elements (knobs, sliders) hide gracefully on mobile while preserving the core branding.

2. **Hero Section (Landing Page)**
   - Adjust responsive typography: Scale down massive headings on mobile (`text-4xl` instead of `text-6xl+`) while keeping desktop untouched.
   - Optimize the Call to Action (CTA) buttons: Stack them cleanly on mobile with full width, but keep them side-by-side on desktop.
   - Ensure the hero background video/image has proper mobile framing and overlay gradients for text readability.

3. **Global Layout & Spacing**
   - **Padding Fixes:** Replace harsh fixed paddings (e.g., `px-12`) with responsive paddings (`px-4 sm:px-8 lg:px-12`) across all main container components.
   - **Gaps & Margins:** Tighten vertical spacing (`py`) between sections on mobile to prevent excessive scrolling, while maintaining large breathing room on desktop.

4. **Component Grids (Songs, Projects, Services, Contributors)**
   - Ensure all `grid` layouts gracefully collapse to 1 column (`grid-cols-1`) on mobile screens, expanding to 2 or 3 columns on tablet/desktop.
   - Add subtle touch-friendly interactions (e.g., active states for mobile since hover doesn't exist).
   - Ensure card borders and shadows look premium on small screens (using glassmorphism where appropriate).

5. **Footer**
   - Refactor the footer grid to stack vertically on mobile screens.
   - Center-align text and social icons on mobile for a balanced, modern look.
   - Ensure bottom legal text and copyright do not overflow.

## Execution Strategy

### 1. `src/components/layout/Navbar.jsx`
- [MODIFY] Rewrite the mobile menu overlay to use a sliding drawer approach (`translate-x-full` to `translate-x-0`).
- [MODIFY] Enhance mobile menu typography and add a sleek glowing "Book Session" button.

### 2. `src/app/[locale]/page.jsx` (Landing Page)
- [MODIFY] Adjust `text-` and `px-`/`py-` utility classes on the Hero section headers and subheaders.
- [MODIFY] Update the grid layouts in the "Featured Services" and "Latest Projects" sections to ensure `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` scaling.

### 3. Content Modules (`src/components/public/`)
- [MODIFY] `SongsClient.jsx`: Ensure the masonry/grid layout is 1 column on mobile.
- [MODIFY] `ProjectsClient.jsx`: Fix card widths and padding for mobile view.
- [MODIFY] `ContributorsShowcaseClient.jsx`: Optimize the display of contributor profiles so they don't break horizontal boundaries.
- [MODIFY] `ServicesPageClient.jsx`: Stack service details and pricing elegantly on smaller screens.

### 4. `src/components/layout/Footer.jsx`
- [MODIFY] Add `flex-col` and `md:flex-row` rules to grid containers to stack columns neatly.

## Verification Plan

### Automated/Build Verification
- Run `npm run build` to ensure no syntax errors were introduced in the JSX.
- Ensure all Tailwind classes are valid and compile correctly.

### Manual Verification
- Resize the browser window to mobile width (375px - 414px) and verify:
  - The Navbar drawer opens smoothly.
  - No horizontal scrolling (overflow-x) occurs anywhere on the site.
  - Typography is legible and appropriately sized.
  - Touch targets (buttons, links) are large enough and spaced well.
  - Desktop view remains entirely identical to the current design.

> [!IMPORTANT]  
> Before I proceed with making these code modifications, please review this plan and let me know if you approve or if you'd like to add any specific styling requests (e.g., specific colors or animations for the mobile menu).
