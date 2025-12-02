## ⚡ Setting Up Mithril + Vite Using Vitriol

[Vitriol](https://github.com/DeJy/vitriol) is a lightweight npm package that integrates [Mithril](https://mithril.js.org/) with [Vite](https://vitejs.dev/) and [Ionic Framework](https://ionicframework.com/), enabling fast and modern frontend development.

### 🛠 Prerequisites

Make sure you have the following before starting:

- Node.js and npm installed
- Your preferred code editor
- Basic knowledge of JavaScript and Mithril

---

### 🚀 Step 1: Create Your Project with Vitriol

```bash
npm create vitriol@latest
```

*If you're using Vitriol for the first time, npm will prompt you to install the package.*

---

### 🧩 Step 2: Configure Project Setup

You’ll be asked to choose:

- Project type: `JSX` or `Standard`
- Language: `JavaScript` or `TypeScript`
- Project name (default is `vitriol-project`)
- Whether to include the [Ionic Framework](https://ionicframework.com/) (we recommend including it for this demo)
- Add `devcontainer.json` configuration?
This option lets you set up a [Development Container] (https://code.visualstudio.com/docs/devcontainers/containers) for seamless coding in environments like GitHub Codespaces or VS Code Remote. Choose Yes if you want to enable this feature.


📌 If you use a custom project name, replace `vitriol-project` in subsequent steps with your chosen name.

Alternatively, you can use command-line arguments to skip prompts:

```bash
# Example: Create a TypeScript project with Standard syntax
npm create vitriol@latest my-app -- --standard --ts
```

---

### 📦 Step 3: Install Dependencies

```bash
cd vitriol-project
npm install
```

Wait until installation completes.

---

### 🌐 Step 4: Start Development Server

```bash
npm run dev
```

Then open the URL displayed in your terminal to see your running app in the browser.

---

### 🔧 Step 5: Explore and Update the App

The source files are in the `/src` folder.

- `main.js` (or `main.ts`) sets up components and Mithril routes automatically
- All `.js`, `.jsx`, `.ts`, or `.tsx` files inside `/pages` are auto-registered as routes
- Access pages via URLs like `/#/pagename` or programmatically with `m.route.set("/pagename")`

---

### ✅ Step 6: Automate Testing with Vitest

Tests live in the `/test` folder.

To run them:

```bash
npm run test
```

---

### 📦 Step 7: Build for Production

```bash
npm run build
```
- The build output is placed in the `/dist` directory

```bash
npm run preview
```
- To test your production-ready files locally before deploying


