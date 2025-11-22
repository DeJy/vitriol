# Vitriol Tutorial (JSX)

Welcome to your new Vitriol project! This tutorial will guide you through the basics of creating pages, handling routing, and building your application using JSX.

## Project Structure

- `src/pages/`: Directory for your application pages.
- `src/components/`: Directory for reusable components.
- `src/main.js`: Entry point, handles routing and initialization.
- `src/lib/`: Utility functions.

## 1. Creating a New Page

Vitriol uses a file-system based routing convention. To create a new page, simply add a `.jsx` file to the `src/pages/` directory.

**Example:** Create `src/pages/about.jsx`

```jsx
export default function About() {
  return {
    view: () => {
      return (
        <div>
          <h1>About Us</h1>
          <p>This is the about page.</p>
          <button onclick={() => m.route.set("/home")}>Go Home</button>
        </div>
      )
    }
  }
}
```

By default, this page will be accessible at `/about`.

### Customizing the Route

You can define a custom route by exporting a `route` constant from your page file.

```javascript
export const route = "/about-us"; // Now accessible at /about-us instead of /about
```

## 2. Passing Parameters

To pass parameters to a page (e.g., `/user/:id`), export an `attrs` array containing the parameter names.

**Example:** Create `src/pages/user.jsx`

```jsx
export const attrs = ['id']; // Defines /user/:id

export default function User() {
  return {
    view: ({ attrs }) => {
      return (
        <div>
          <h1>User Profile</h1>
          <p>User ID: {attrs.id}</p>
        </div>
      )
    }
  }
}
```

You can navigate to this page using `m.route.set('/user/123')`.

## 3. Using Components

Create reusable components in `src/components/`.

**Example:** `src/components/MyButton.jsx`

```jsx
export function MyButton() {
  return {
    view: ({ attrs, children }) => {
      return (
        <button class="my-btn" onclick={attrs.onclick}>
          {children}
        </button>
      )
    }
  }
}
```

**Usage in a page:**

```jsx
import { MyButton } from '../components/MyButton';

// ... inside view
<MyButton onclick={() => alert('Clicked!')}>Click Me</MyButton>
```

## 4. Running Tests

This project uses [Vitest](https://vitest.dev/) for testing.

Run tests with:
```bash
npm run test
```

To create a test, add a `.test.jsx` file (e.g., `tests/pages/about.test.jsx`).

```jsx
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
