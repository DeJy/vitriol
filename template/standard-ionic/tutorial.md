# Vitriol Tutorial (Standard + Ionic)

Welcome to your new Vitriol project! This template combines Mithril.js with Ionic Framework for building mobile-ready applications.

## Project Structure

- `src/pages/`: Directory for your application pages.
- `src/components/`: Directory for reusable components.
- `src/modals/`: Directory for Ionic modals.
- `src/main.js`: Entry point, handles routing and Ionic initialization.
- `src/lib/`: Utility functions.

## 1. Creating a New Page

Vitriol uses a file-system based routing convention. To create a new page, simply add a `.js` file to the `src/pages/` directory.

**Example:** Create `src/pages/about.js`

```javascript
export default function About() {
  return {
    view: () => {
      return m("ion-page", [
        m("ion-header", [
          m("ion-toolbar", [
            m("ion-title", "About Us")
          ])
        ]),
        m("ion-content", { class: "ion-padding" }, [
          m("h1", "About Us"),
          m("p", "This is the about page."),
          m("ion-button", { onclick: () => m.route.set("/home") }, "Go Home")
        ])
      ])
    }
  }
}
```

By default, this page will be accessible at `/about`. Note the use of Ionic Web Components like `ion-page`, `ion-header`, and `ion-content`.

### Customizing the Route

You can define a custom route by exporting a `route` constant from your page file.

```javascript
export const route = "/about-us"; // Now accessible at /about-us instead of /about
```

## 2. Passing Parameters

To pass parameters to a page (e.g., `/user/:id`), export an `attrs` array containing the parameter names.

**Example:** Create `src/pages/user.js`

```javascript
export const attrs = ['id']; // Defines /user/:id

export default function User() {
  return {
    view: ({ attrs }) => {
      return m("ion-page", [
        m("ion-header", [
          m("ion-toolbar", [
            m("ion-buttons", { slot: "start" }, [
              m("ion-back-button")
            ]),
            m("ion-title", "User Profile")
          ])
        ]),
        m("ion-content", { class: "ion-padding" }, [
          m("p", "User ID: " + attrs.id)
        ])
      ])
    }
  }
}
```

You can navigate to this page using `m.route.set('/user/123')`.

## 3. Using Components

Create reusable components in `src/components/`.

**Example:** `src/components/MyCard.js`

```javascript
export function MyCard() {
  return {
    view: ({ attrs, children }) => {
      return m("ion-card", [
        m("ion-card-header", [
          m("ion-card-title", attrs.title)
        ]),
        m("ion-card-content", children)
      ])
    }
  }
}
```

**Usage in a page:**

```javascript
import { MyCard } from '../components/MyCard';

// ... inside view
m(MyCard, { title: "Welcome" }, "This is a card content.")
```

## 4. Running Tests

This project uses [Vitest](https://vitest.dev/) for testing.

Run tests with:
```bash
npm run test
```

To create a test, add a `.test.js` file (e.g., `tests/pages/about.test.js`).

```javascript
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
