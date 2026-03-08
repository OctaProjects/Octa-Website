# Octa Website – Code Guide

---

## Project Structure

```
src/
├── main.jsx          # Entry point
├── App.jsx           # Main app & routing
├── styles.css        # Global styles
├── PartnerPage.jsx   # Partner sign-up page
├── DesignPage.jsx   # Creative Design service page
├── WebDevelopmentPage.jsx  # Web dev service page
├── AboutPage.jsx     # About us & team
└── assets/           # Images & media
```

---

## main.jsx

- Renders the React app into `#root`
- Imports global CSS
- Uses React StrictMode for dev checks

---

## App.jsx – Main Logic

### Routing (Hash-based)

- `normalizePage(hash)` – Converts URL hash to valid page key
- Allowed pages: home, about, services, contacts, faqs, partner, creative-design, web-development, it-helpdesk

### State Variables

| Variable | Description |
|----------|-------------|
| `page` | Current page ID |
| `showPartner` | Whether Partner page is shown |
| `theme` | 'light' or 'dark' |
| `isScrolled` | User has scrolled past header |
| `mobileMenuOpen` | Mobile nav menu open/closed |
| `activeSection` | Which section is in view (for nav highlight) |
| `scrollProgress` | Scroll progress 0–100% |

### Effects (useEffect)

| Effect | Description |
|--------|-------------|
| Hash change | Listens to `hashchange`, updates page |
| Theme | Applies theme to `<html>`, saves to localStorage |
| Scroll to top | On page change, scroll to top |
| Close mobile menu | On page change, close mobile nav |
| Scroll progress | Updates progress bar on scroll |
| Section observer | Highlights nav link for visible section |
| Arc animation | Sets SVG path length for draw effect |
| Reveal animations | IntersectionObserver for scroll-reveal |

---

## styles.css – Sections

| Section | Description |
|---------|-------------|
| `:root` | CSS variables for colors, theme |
| Header | Sticky header, nav, hamburger, theme toggle |
| Hero | Main hero with arc SVG |
| Sections | Products, Services, Contacts, FAQs |
| Footer | Footer layout and links |
| Responsive | Media queries for mobile/tablet/desktop |
| Animations | Keyframes for reveal, arc draw, etc. |

---

## Page Components

| Component | Description |
|-----------|-------------|
| **PartnerPage** | Partner sign-up form inside arc |
| **DesignPage** | Creative design services (UX, Brand, Illustration, Print) |
| **WebDevelopmentPage** | Web dev services (Apps, E‑commerce, API, Performance) |
| **AboutPage** | Company story, vision, team grid |

---

## CSS Variables (Theme)

| Variable | Description |
|----------|-------------|
| `--bg` | Main background |
| `--text` | Primary text color |
| `--muted` | Secondary text |
| `--primary` | Brand green (accents, arcs) |
| `--accent` | CTA buttons, highlights |
| `--panel` | Card/panel background |
| `--border` | Border color |

---

## Responsive Breakpoints

| Breakpoint | Description |
|------------|-------------|
| 360px | Extra small phones |
| 480px | Small phones |
| 520px | Phones, single-column forms |
| 768px | Tablets, grids collapse |
| 880px | Desktop nav, CTA visible |
| 980px | Wide layout grids |

---

## Common Patterns

### Scroll Reveal

Elements get `.will-reveal` and `.reveal-up`. When they enter viewport, they get `.is-visible` and animate in.

### Arc SVG

SVG path with stroke-dasharray animation. `--arc-len` is set via JS from `path.getTotalLength()`.

### Hash Routing

No React Router. Uses `window.location.hash` (#home, #about, etc.) and `hashchange` event.
