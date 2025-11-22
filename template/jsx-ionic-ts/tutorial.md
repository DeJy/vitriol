# Vitriol Tutorial (JSX + Ionic + TypeScript)

Welcome to your new Vitriol project! This template combines Mithril.js (with JSX), Ionic Framework, and TypeScript for building robust mobile-ready applications.

## Project Structure

- `src/pages/`: Directory for your application pages.
- `src/components/`: Directory for reusable components.
- `src/modals/`: Directory for Ionic modals.
- `src/main.ts`: Entry point, handles routing and Ionic initialization.
- `src/lib/`: Utility functions.

## 1. Creating a New Page

Vitriol uses a file-system based routing convention. To create a new page, simply add a `.tsx` file to the `src/pages/` directory.

**Example:** Create `src/pages/about.tsx`

```tsx
import m from "mithril";

export default function About() {
  return {
    view: () => {
      return (
        <ion-page>
          <ion-header>
            <ion-toolbar>
              <ion-title>About Us</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <h1>About Us</h1>
            <p>This is the about page.</p>
            <ion-button onclick={() => m.route.set("/home")}>Go Home</ion-button>
          </ion-content>
        </ion-page>
      )
    }
  }
}
```

By default, this page will be accessible at `/about`.

### Customizing the Route

You can define a custom route by exporting a `route` constant from your page file.

```typescript
export const route = "/about-us"; // Now accessible at /about-us instead of /about
```

## 2. Passing Parameters

To pass parameters to a page (e.g., `/user/:id`), export an `attrs` array containing the parameter names.

**Example:** Create `src/pages/user.tsx`

```tsx
import m from "mithril";

export const attrs = ['id']; // Defines /user/:id

export default function User() {
  return {
    view: ({ attrs }: m.Vnode<{ id: string }>) => {
      return (
        <ion-page>
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button></ion-back-button>
              </ion-buttons>
              <ion-title>User Profile</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <p>User ID: {attrs.id}</p>
          </ion-content>
        </ion-page>
      )
    }
  }
}
```

You can navigate to this page using `m.route.set('/user/123')`.

## 3. Using Components

Create reusable components in `src/components/`.

**Example:** `src/components/MyCard.tsx`

```tsx
import m from "mithril";

interface CardAttrs {
  title: string;
}

export function MyCard() {
  return {
    view: ({ attrs, children }: m.Vnode<CardAttrs>) => {
      return (
        <ion-card>
          <ion-card-header>
            <ion-card-title>{attrs.title}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {children}
          </ion-card-content>
        </ion-card>
      )
    }
  }
}
```

**Usage in a page:**

```tsx
import { MyCard } from '../components/MyCard';

// ... inside view
<MyCard title="Welcome">This is a card content.</MyCard>
```

## 4. Running Tests

This project uses [Vitest](https://vitest.dev/) for testing.

Run tests with:
```bash
npm run test
```

To create a test, add a `.test.tsx` file (e.g., `tests/pages/about.test.tsx`).

```tsx
import { describe, it, expect } from 'vitest'
import mq from 'mithril-query'
import About from '../../src/pages/about'

describe('About Page', () => {
  it('should render correctly', () => {
    const out = mq(About)
    out.should.contain('About Us')
  })
})
```

## 5. Building for Production

To build your application for production:

```bash
npm run build
```

The output will be in the `dist/` directory. You can preview the build with `npm run preview`.
