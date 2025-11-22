<p align="center">
  <img src="./vitriollogo.png" width="200px" alt="Vitriol Logo">
</p>

# create-vitriol

[![npm version](https://img.shields.io/npm/v/create-vitriol.svg)](https://www.npmjs.com/package/create-vitriol)
[![License](https://img.shields.io/npm/l/create-vitriol.svg)](./LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/create-vitriol.svg)](https://www.npmjs.com/package/create-vitriol)

A scaffolding tool for creating [Mithril.js](https://mithril.js.org/) projects powered by [Vite](https://vitejs.dev/).

## Features

- ⚡️ **Fast**: Powered by Vite for lightning-fast development and building.
- 🔧 **Flexible**: Choose between Standard (Hyperscript) or JSX syntax.
- 📘 **TypeScript**: Optional TypeScript support for type safety.
- 📱 **Ionic**: Optional [Ionic Framework](https://ionicframework.com/) integration for building mobile-ready apps.
- 🐳 **DevContainer**: Optional DevContainer configuration for consistent development environments.

## Usage

With **NPM**:

```bash
npm create vitriol@latest
```

With **Yarn**:

```bash
yarn create vitriol
```

With **PNPM**:

```bash
pnpm create vitriol
```

With **Bun**:

```bash
bun create vitriol
```

### Interactive Mode

Simply run the command without arguments to start the interactive prompt. You will be asked to:

1.  Select a project type (**Standard** or **JSX**).
2.  Enter a project name (which will be the folder name).
3.  Choose whether to use **TypeScript**.
4.  Choose whether to include **Ionic** integration.
5.  Choose whether to include **DevContainer** configuration.

### Command Line Arguments

You can also pass arguments directly to skip some prompts:

```bash
npm create vitriol@latest [target-dir] [options]
```

> **Note:** If you are using `npm create` or `npm init`, you may need to use a double dash `--` to pass flags to the generator, e.g., `npm create vitriol@latest my-app -- --standard`.

- `[target-dir]`: The directory to create the project in.

**Options:**

- `--standard`, `--std`: Use Standard (Hyperscript) template.
- `--jsx`: Use JSX template.
- `-i`, `--ionic`: Enable Ionic integration.
- `--noi`, `--no-ionic`: Disable Ionic integration (skip prompt).
- `--dc`, `--devcontainer`: Add DevContainer configuration.
- `--nodc`, `--no-devcontainer`: Disable DevContainer configuration (skip prompt).
- `--ts`, `--typescript`: Use TypeScript.
- `--js`, `--javascript`: Use JavaScript.

### Examples

Create a standard Mithril project in a folder named `my-app`:

```bash
npm create vitriol@latest my-app -- --standard
```

Create a standard Mithril project with TypeScript:

```bash
npm create vitriol@latest my-app -- --standard --ts
```

Create a JSX Mithril project with Ionic support:

```bash
npm create vitriol@latest my-ionic-app -- --jsx --ionic
```

## Templates

The tool provides the following templates based on your selections. Each template comes with a specific tutorial:

- `standard`: Hyperscript + JavaScript ([Tutorial](./template/standard/tutorial.md))
- `standard-ts`: Hyperscript + TypeScript ([Tutorial](./template/standard-ts/tutorial.md))
- `standard-ionic`: Hyperscript + JavaScript + Ionic ([Tutorial](./template/standard-ionic/tutorial.md))
- `standard-ionic-ts`: Hyperscript + TypeScript + Ionic ([Tutorial](./template/standard-ionic-ts/tutorial.md))
- `jsx`: JSX + JavaScript ([Tutorial](./template/jsx/tutorial.md))
- `jsx-ts`: JSX + TypeScript ([Tutorial](./template/jsx-ts/tutorial.md))
- `jsx-ionic`: JSX + JavaScript + Ionic ([Tutorial](./template/jsx-ionic/tutorial.md))
- `jsx-ionic-ts`: JSX + TypeScript + Ionic ([Tutorial](./template/jsx-ionic-ts/tutorial.md))

## License

[MIT](./LICENSE)

## Tutorial

Tutorial can be found [here](https://dev.to/dejy/vitriol-mithrilvite-3ba1)


