# End-to-End Tests for PokerPlanning.org

This directory contains comprehensive end-to-end tests for the PokerPlanning.org application, with a focus on the newly redesigned home page and SEO enhancements.

## Test Files

### 1. `home-page.spec.ts`

Basic smoke test for the home page that verifies:

- Logo and navigation elements
- Main heading and sections
- Theme toggle functionality
- Start New Game button
- All major content sections are present

### 2. `home-page-seo.spec.ts`

Comprehensive SEO and content tests including:

- **Meta Tags**: Title, description, keywords, Open Graph, Twitter Cards
- **Structured Data**: JSON-LD schemas for SoftwareApplication, Organization, FAQPage
- **Hero Section**: Modern design elements, animated badges, gradient text
- **How It Works**: 4-step process with descriptions
- **Why Choose Us**: Benefits, pricing ($0 forever), coming soon features
- **Use Cases**: Bingo layout with 4 main cards
- **FAQ Section**: Expandable/collapsible questions
- **Call to Action**: Final CTA before footer
- **Footer**: Enhanced navigation with Product, Company, Legal sections

### 3. `home-page-interactions.spec.ts`

Interactive functionality tests:

- **Theme Toggle**: Dark/light mode switching
- **Room Creation**: Start New Game and CTA buttons with GraphQL mocking
- **FAQ Expansion**: Click to expand/collapse FAQ items
- **External Links**: GitHub links open in new tabs
- **Footer Navigation**: Internal anchor links
- **Hover Effects**: Interactive element hover states
- **Responsive Design**: Mobile viewport testing
- **Animations**: Pulse effects and gradients
- **Image Loading**: Logo and icons render correctly

### 4. `home-page-accessibility.spec.ts`

Accessibility compliance tests:

- **Heading Hierarchy**: Proper h1, h2, h3 structure
- **Interactive Labels**: All buttons and links have accessible names
- **Alt Text**: All images have descriptive alt attributes
- **Color Contrast**: Basic contrast validation
- **Keyboard Navigation**: Tab order and keyboard interactions
- **ARIA Attributes**: Proper landmarks and ARIA labels
- **Focus Indicators**: Visible focus states
- **Responsive Accessibility**: Mobile and tablet viewports
- **Reduced Motion**: Animation preferences respected
- **Automated Scan**: Full axe-core accessibility audit

### 5. `seo-technical.spec.ts`

Technical SEO and infrastructure tests:

- **robots.txt**: Proper configuration and disallow rules
- **sitemap.xml**: Valid XML with all required URLs
- **manifest.json**: PWA manifest availability
- **Favicon**: Icon and apple-touch-icon setup
- **Meta Viewport**: Mobile responsiveness
- **Language Attribute**: HTML lang attribute
- **Internal Links**: All links are valid
- **External Links**: Proper target="\_blank" and rel attributes
- **Performance Metrics**: Page load time benchmarks

### 6. `home-page-complete.spec.ts`

Consolidated test suite that combines the most important tests from all files for quick validation.

## Running Tests

### Run all tests

```bash
npm run test:e2e:headless
```

### Run specific test file

```bash
npm run test:e2e:headless home-page-seo.spec.ts
```

### Run tests in headed mode (see browser)

```bash
npm run test:e2e -- --headed
```

### Run tests in UI mode

```bash
npm run test:e2e:ui
```

## Test Coverage

The test suite covers:

- ✅ All new SEO optimizations
- ✅ Hero section redesign
- ✅ How It Works section
- ✅ Why Choose Us section with pricing
- ✅ Use Cases bingo layout
- ✅ FAQ expandable section
- ✅ Call to Action section
- ✅ Enhanced footer navigation
- ✅ Theme toggle functionality
- ✅ Room creation flow
- ✅ Responsive design
- ✅ Accessibility compliance
- ✅ Performance metrics

## Prerequisites

Before running tests:

1. Start the development server: `npm run dev`
2. Ensure the GraphQL backend is running (or tests will use mocked responses)
3. Tests expect the app to be available at `http://localhost:5173/`

## Debugging Failed Tests

If tests fail:

1. Check the Playwright HTML report: `npx playwright show-report`
2. Use `--debug` flag to step through tests
3. Take screenshots on failure by adding to test:
   ```typescript
   await page.screenshot({ path: "screenshot.png" });
   ```
