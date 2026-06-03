Project Memory - WKND Adventures and Travel

Migrating the WKND Adventures and Travel homepage (https://wknd.site/us/en.html) to Adobe Edge Delivery Services.
⸻
⚠️ CRITICAL RULES

1. NEVER create screenshots outside /tmp folder - All screenshots MUST be saved to /tmp/ directory. Never save screenshots to project root or any workspace folder.
2. Always read files before editing - Never modify code without reading it first.
3. Use box-sizing: border-box - When setting explicit width/height on elements with padding.
⸻
Site Overview

WKND is a fictitious adventure and travel brand built by Adobe to demonstrate Adobe Experience Manager (AEM). The site showcases outdoor activities, travel, music, crafts, and adventure sports.

Live site: https://wknd.site/us/en.html 
Source code: https://github.com/adobe/aem-guides-wknd/ 
Built with: AEM Core Components + Archetype

Brand personality: Outdoor, adventurous, community-driven, approachable, youthful.
⸻
Navigation & Site Structure

Primary nav (top header): Home → Magazine, Adventures, FAQs, About Us

Language / Region switcher:
- United States: en-US, es-US
- Canada: en-CA, fr-CA
- Switzerland: de-CH, fr-CH, it-CH
- Germany: de-DE
- France: fr-FR
- Spain: es-ES
- Italy: it-IT

URL pattern: https://wknd.site/{country}/{lang}/{page}.html
⸻
Navigation Content Structure

The nav content uses semantic headings to organize content that header.js parses.

Key Principle: Authors only maintain translatable text. Icons and form markup are added programmatically by JavaScript.
⸻
Fragment Files

Fragment files (/fragments/nav/nav.html, /fragments/footer/footer.html) are loaded by blocks, not rendered as standalone pages.

⚠️ CRITICAL: Fragment files must NOT have <header></header> or <footer></footer> tags in their HTML structure. These tags cause AEM to try loading header/footer blocks on the fragment page itself, creating recursive loading issues.

Correct fragment structure:

<!DOCTYPE html>
<html>
<head>...</head>
<body>
<main>
  <!-- Fragment content here -->
</main>
</body>
</html>


Wrong (causes duplicate header/recursion):

<body>
<header></header>  <!-- ✗ Don't include -->
<main>...</main>
<footer></footer>  <!-- ✗ Don't include -->
</body>

⸻
Footer Content Structure

The footer content uses author-friendly text that JavaScript transforms:

<!-- 1. Social section (first div) -->
<div>
  <p>Follow us:</p>  <!-- Label for authors - removed by JS -->
  <ul>
    <li><a href="#">Facebook</a></li>
    <li><a href="#">Twitter</a></li>
    <li><a href="#">Instagram</a></li>
  </ul>
</div>

<!-- 2. Link columns, copyright sections follow -->


JavaScript Architecture (footer.js):
- buildLogo() - Creates logo link pointing to /icons/logo-inverted.svg
- buildSocialIcons(socialDiv) - Maps platform names to icon files

Social Icon Mapping:

const socialIconMap = {
  Facebook: 'social-facebook.svg',
  Twitter: 'social-twitter.svg',
  Instagram: 'social-instagram.svg',
};


Key Principle: Authors write text links (e.g., "Facebook"), and JavaScript replaces them with corresponding SVG icons. The "Follow us:" label is removed after processing.
⸻
Design Tokens

Defined in /styles/styles.css — reference these variable names, don't hardcode values.
Category	Variables
Brand	--color-brand-primary (#FFEA00 yellow), --link-color, --color-accent
Text	--text-color, --text-color-secondary, --text-color-inverse
Backgrounds	--background-color, --background-color-dark, --background-color-black
Borders	--color-border-light, --color-border-dark
Spacing	--spacing-xxs through --spacing-xxxl (4px to 64px scale)
Typography	--body-font-family (Adobe Clean / sans-serif), --heading-font-family, --heading-font-weight
Shadows	--shadow-card, --shadow-card-elevated
Transitions	--transition-fast, --transition-base, --transition-slow

WKND Brand Colors:
- Primary yellow: #FFEA00
- Dark background: #1a1a1a
- White: #ffffff
- Link/accent: inherits from --link-color
⸻
CSS Guidelines

1. Never use !important — increase selector specificity instead
2. Use CSS custom properties — reference design tokens, override at block level when needed
3. Edge-to-edge blocks — use :has() selector on wrapper: main > div:has(.block-name)
4. Visually hidden text — use clip-path: inset(50%) instead of deprecated clip: rect()
5. Backdrop filter — always include both -webkit-backdrop-filter and backdrop-filter
⸻
Lint Rules

- no-descending-specificity: For complex block CSS with variant overrides, add /* stylelint-disable no-descending-specificity */ at the top of the file
- declaration-block-no-duplicate-properties: Never duplicate CSS properties (except vendor prefixes like -webkit-)
- property-no-deprecated: Use modern equivalents (clip-path not clip)
⸻
Responsive Breakpoints
Breakpoint	Value	Usage
sm	600px	Small mobile / very small tablet
md	768px	Tablet — nav and card adjustments
lg	900px	Desktop — header layout, main nav switch
xl	1024px	Large tablet / small desktop refinements
xxl	1200px	Large desktop — footer columns, max-width

Key layout changes:
- < 900px: Mobile header (hamburger menu)
- ≥ 900px: Desktop header (full nav visible, mega menus)
- ≥ 1200px: Footer expands to multi-column grid

Media query syntax (use modern CSS syntax):

/* Mobile-first */
@media (width >= 900px) { }

/* Desktop-first */
@media (width < 900px) { }

/* Range */
@media (width >= 768px) and (width < 1200px) { }

⸻
EDS Authoring Patterns

- Link → Button: Link alone in its own paragraph becomes a button
- Link stays link: Link inline with other text stays a link
- Section metadata: Use section-metadata block to apply styles like highlight, dark, full-width
- Page templates: Add Template: landing-page-template to page metadata
⸻
Custom Blocks

carousel (Hero / Slides)

Full-width hero carousel with auto-rotation and dark overlay, white text.
Variant	Class	Purpose
Hero	.carousel.hero	Full-width hero, auto-rotation (10s)
Default	.carousel	Simple horizontal scrolling cards (330px)

Home page hero has 3 slides:
1. "WKND Adventures" — View Trips CTA
2. "San Diego Surf Spots" — Full Article CTA
3. "Downhill Skiing Wyoming" — View Trip CTA

cards (Adventures / Articles)

Used across the adventures listing page and magazine.

- Adventure cards: image + title + description + CTA link
- Magazine cards: image + article title + excerpt

Adventures listing page supports filterable tabs:
- All, Climbing, Cycling, Skiing, Surfing, Travel

Adventure list (current):
- Bali Surf Camp, Beervana in Portland, Climbing New Zealand, Colorado Rock Climbing, Cycling Southern Utah, Cycling Tuscany, Downhill Skiing Wyoming, Gastronomic Marais Tour, Napa Wine Tasting, Riverside Camping, Ski Touring Mont Blanc, Surf Camp in Costa Rica, Tahoe Skiing, West Coast Cycling, Whistler Mountain Biking, Yosemite Backpacking

teaser (Featured Article)

Large image + heading + body text + CTA.

Current featured: "Camping in Western Australia"

columns (Recent Articles / Next Adventures)

Article listing grid and "Where do you want to go?" adventure grid on homepage.

Recent Articles:
- Ultimate Guide to LA Skateparks
- Ski Touring
- Arctic Surfing
- San Diego Surf Spots

"Next Adventures" feature: Climbing New Zealand with supporting adventure cards grid

header (Navigation)

Single-row fixed header with logo left, nav links center/right.

Visual Structure:
1. nav-brand — WKND logo (uses /icons/logo.svg on light bg, /icons/logo-inverted.svg on dark bg)
2. nav-sections — Home, Magazine, Adventures, FAQs, About Us
3. nav-tools — Sign In / Sign Out, Language switcher

JavaScript Architecture (header.js):
- buildBrandLogo(brandDiv) — Replaces text link with SVG logo image
- buildNavSections(nav) — Finds nav section headings and creates dropdown structure
- Mobile: hamburger menu toggle, sections hidden until expanded

footer (Two-Row Layout)

Dark footer with logo, nav links, social icons, and copyright.

Structure:
1. Logo + Nav Row: WKND logo, nav links (Home, Magazine, Adventures, FAQs, About Us)
2. Social + Copyright Row: Follow Us (Facebook, Twitter, Instagram) + copyright text

Color Scheme:
- Background: dark (#1a1a1a or similar)
- Text/links: white or light
- Social icons: SVG from /icons/

Copyright: "© 2019, WKND Site."
⸻
Page Structure (us/en.html — Homepage)

1. Hero carousel — 3 slides: Adventures, San Diego Surf Spots, Downhill Skiing Wyoming
2. Featured Article teaser — "Camping in Western Australia" full-width
3. Recent Articles — 4 article cards grid
4. "Next Adventures" — Climbing New Zealand teaser + adventure cards grid (Yosemite Backpacking, Whistler Mountain Biking, West Coast Cycling, Tahoe Skiing)
5. Footer
⸻
Page Structure (us/en/adventures.html)

1. Hero teaser — "Experience the world with us" + hero image
2. Filterable adventure cards — Tabs: All, Climbing, Cycling, Skiing, Surfing, Travel
3. Footer
⸻
Page Structure (us/en/magazine.html)

Articles listing with card grid.
⸻
Localization

Base locale: us/en

All translated versions mirror the same URL structure with {country}/{lang}/ prefix.

Language switcher in header links to equivalent page in selected locale.
⸻
Local Assets

Icons (/icons/):
- Logos: logo.svg (dark, for light backgrounds), logo-inverted.svg (white/light, for dark backgrounds)
- Social icons: social-facebook.svg, social-twitter.svg, social-instagram.svg

Images (/content/images/ or AEM DAM paths):
- Adventure photos and article hero images served from AEM CDN
- Format: .jpeg / .png
- AEM image path pattern: /_jcr_content/root/container/...coreimg.jpeg/...
⸻
CSS Style Guide

Color Syntax

Always use CSS Color Level 4 syntax:

/* ✓ Correct */
color: rgb(0 0 0 / 95%);
background: rgb(255 255 255 / 50%);

/* ✗ Avoid */
color: rgba(0, 0, 0, 0.95);
background: rgba(255, 255, 255, 0.5);


CSS Variables Usage

1. Always use tokens for: colors, spacing, typography, shadows, transitions
2. Define new tokens only if a value is used 2+ times across different files
3. Keep hardcoded intentional design dimensions (specific widths like 330px, icon sizes)

Comment Format

/* = SECTION NAME = */


Block CSS Scoping

- Scope all styles to the block class: .my-block .child-element
- Avoid external context selectors unless necessary
- Use :has() on wrapper for edge-to-edge blocks: main > div:has(.my-block)

Fixed Dimensions with Padding

/* ✓ Correct */
.card {
  box-sizing: border-box;
  width: 330px;
  padding: 16px;
}

/* ✗ Wrong - actual size will be larger than intended */
.card {
  width: 330px;
  padding: 16px;
}


Font Family

/* ✓ Correct */
font-family: var(--body-font-family);

/* ✗ Avoid */
font-family: 'Adobe Clean', sans-serif;

⸻
JavaScript Style Guide

Block Module Pattern

// ✓ Correct
export default function decorate(block) { ... }

// ✗ Avoid - unless function is imported elsewhere
export function showSlide() { ... }


DOM Manipulation

1. Use document.createElement() for structural elements
2. innerHTML = '' is acceptable for clearing containers
3. innerHTML with template literals acceptable for fully controlled static content (no user input)
4. Always scope queries to block: block.querySelector('.child')

Accessibility

Always include ARIA attributes on interactive elements:
- aria-label on buttons without visible text
- aria-hidden on decorative elements
- aria-expanded on toggleable sections (e.g., mobile nav, dropdowns)
⸻
Reminders

1. Screenshots → /tmp/ ONLY — Never save to project root or workspace
2. Always read files before editing
3. Test in preview at localhost:3000
4. Check hover states — many elements have specific behaviors
5. Follow existing AEM patterns in the codebase
6. Update this file when learning new project-specific patterns
7. Use box-sizing: border-box when setting width/height on padded elements
8. Fragment files must NOT have <header> or <footer> tags
9. Nav content uses heading structure that JS parses — icons added programmatically
10. The WKND brand yellow (#FFEA00) is the signature accent color — use it deliberately
