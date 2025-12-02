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

Vitriol keeps every variant in sync by sourcing shared `.vitriol` files from the `template/` root. During scaffolding it also copies the matching markdown tutorial from `template/tutorials` into the generated project.

| Template | Syntax | Ionic | Tutorial source |
| --- | --- | --- | --- |
| `standard` | Hyperscript + JavaScript | No | [template/tutorials/standard-js.md](template/tutorials/standard-js.md) |
| `standard-ts` | Hyperscript + TypeScript | No | [template/tutorials/standard-ts.md](template/tutorials/standard-ts.md) |
| `standard-ionic` | Hyperscript + JavaScript | Yes | [template/tutorials/standard-ionic-js.md](template/tutorials/standard-ionic-js.md) |
| `standard-ionic-ts` | Hyperscript + TypeScript | Yes | [template/tutorials/standard-ionic-ts.md](template/tutorials/standard-ionic-ts.md) |
| `jsx` | JSX + JavaScript | No | [template/tutorials/jsx-js.md](template/tutorials/jsx-js.md) |
| `jsx-ts` | JSX + TypeScript | No | [template/tutorials/jsx-ts.md](template/tutorials/jsx-ts.md) |
| `jsx-ionic` | JSX + JavaScript | Yes | [template/tutorials/jsx-ionic-js.md](template/tutorials/jsx-ionic-js.md) |
| `jsx-ionic-ts` | JSX + TypeScript | Yes | [template/tutorials/jsx-ionic-ts.md](template/tutorials/jsx-ionic-ts.md) |

## License

[MIT](./LICENSE)

## Tutorial

Tutorial can be found [here](https://dev.to/dejy/vitriol-mithrilvite-3ba1)

## Developer Tutorial

Want to contribute to the generator itself? Read [tutorial-dev.md](./tutorial-dev.md) for instructions on local setup, editing `.vitriol` templates, packaging the VS Code syntax extension, and submitting issues or pull requests.


