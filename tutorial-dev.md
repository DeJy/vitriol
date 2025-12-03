# Vitriol Developer Tutorial

This guide walks through everything you need to hack on Vitriol itself; from understanding the template pipeline to publishing syntax updates and contributing fixes.

## 1. Prerequisites

- Node.js 20.19+ and npm 10.8.2+
- Git and a GitHub account
- VS Code (recommended) with the ability to install VSIX packages
- Familiarity with Mithril, Vite, and basic TypeScript

## 2. Repository Setup

1. **Fork** `https://github.com/DeJy/vitriol` and clone your fork locally:
   ```bash
   git clone https://github.com/<you>/vitriol.git
   cd vitriol
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the CLI (generates `dist/index.mjs` consumed by `index.js`):
   ```bash
   npm run build
   ```
4. Install the syntax tooling dependencies (optional but recommended when editing grammars):
   ```bash
   cd syntaxes
   npm install
   cd ..
   ```

## 3. Project Layout Essentials

| Path | Purpose |
| --- | --- |
| `src/index.js` | Source for the `create-vitriol` CLI. Run locally via `node src/index.js ...`. |
| `template/` | Canonical template files written in `.vitriol` format. Conditional blocks (`// if ... // end ...`) allow a single source of truth for every variant. |
| `template/.devcontainer` | Boilerplate DevContainer config copied when users opt in. |
| `template/tutorials` | Markdown files injected as `tutorial.md` per project type/language/Ionic combo. |
| `template/test` | Shared Vitest suites. The CLI handles `.js` vs `.ts` output automatically. |
| `syntaxes/` | VS Code language configuration and TextMate grammar, packaged as `vitriol-syntax-*.vsix`. |
| `tests/` | Vitest suites for the CLI itself (`index.test.js`, `integration.test.js`). |

### Working with `.vitriol` Files

- File names may include dynamic suffixes like `[view]`; `src/index.js` resolves the final extension based on selected language/project type.
- Conditional sections use `// if condition ... // else condition ... // end condition` and run through `evaluateConditionalBlocks`.
- TypeScript-only snippets belong in `/*@ts ... */` blocks so JS projects stay lean.

### Template Variables (`§{...}`)

- Any occurrence of `§{variableName}` inside a `.vitriol` file is replaced at scaffold time via `replaceVariablesInContent` (see `src/index.js`).
- A few core variables are always available:
   - `projectName`: Folder name chosen by the user.
   - `packageName`: Either the prompt answer or the sanitized project name.
   - `projectType`: `'standard'` or `'jsx'`.
   - `language`: `'javascript'` or `'typescript'`.
   - `isIon`, `isTs`, `isJs`, `isJSX`, `isStd`: Boolean flags mirroring the selections.
   - `ext`: Convenience extension (`js`, `ts`, `jsx`, `tsx`) computed from `language` + `projectType`.
- Use these tokens to personalize README copy, package metadata, or inline comments without duplicating files. For example:
   ```md
   # Welcome to §{projectName}
   ```
- If you need a new variable, add it to the `variables` object inside `init()` before calling `processTemplatedFiles`, then document it here so other contributors can reuse it.

## 4. Template & Tutorial Workflow

1. Edit the relevant `.vitriol` file under `template/`. There are no per-variant folders anymore—everything flows from this shared source.
2. When you need project-specific markdown, update the matching file inside `template/tutorials` (see `tutorial.md` for the mapping table).
3. Scaffold sample projects straight from source to verify changes:
   ```bash
   node src/index.js demo --standard --typescript --no-ionic
   ```
4. Run the shared test suites in a generated project with `npm run test`, then delete the temporary directory.
5. Before committing, run:
   ```bash
   npm run build
   npm run integration
   ```
   The integration suite creates every template variation, installs dependencies, runs tests, and builds, ensuring your template edits are consistent.

## 5. VS Code Syntax Package

To get `.vitriol` highlighting while developing:

1. Build (or reuse) the packaged VSIX:
   ```bash
   cd syntaxes
   npm install        # if not already done
   npm run package    # optional script if you add one; otherwise use vsce/package manually
   cd ..
   ```
   The repository already ships with `syntaxes/vitriol-syntax-0.0.1.vsix`. Update the version/file whenever you change the grammar.
2. In VS Code, open **Extensions** → `…` menu → **Install from VSIX…** and select the `.vsix` file.
3. Reload VS Code to activate highlighting for `.vitriol` files.

## 6. Managing Templates Programmatically

- **Adjusting File Extensions**: `adjustPartialFileExtension` in `src/index.js` controls how `.vitriol` outputs become `.js/.ts/.jsx/.tsx`. If you add new directories that must stay JavaScript-only (similar to `/test`), update that helper.
- **Dynamic Extensions**: `resolveDynamicExtension` processes filename tokens like `[view]`. To add a new token, extend `dynamicExtensionResolvers`.
- **Common Assets**: `collectVitriolRelativePaths` gathers `.vitriol` files from `template/`, then `processTemplatedFiles` applies replacements and writes them into the generated project. Keep new assets inside this folder so every template benefits automatically.
- **Tutorial Selection**: `getTutorialFileName` picks the markdown file from `template/tutorials` based on `{projectType, installIonic, language}`. Update it when introducing new project types.

## 7. Running & Testing the CLI

- **Unit tests**: `npm run test`
- **Integration tests**: `npm run integration`
- **Local CLI**: `node src/index.js <targetDir> [flags]`
- **Published CLI build**: `npm run build` populates `dist/`. After building you can test the production entrypoint with `node index.js ...`.

## 8. Reporting Issues & Sending Pull Requests

1. **Issues**:
   - Search existing issues first.
   - Provide repro steps, console output, and template/language choices.
   - Include CLI version (`npm create vitriol@x.y.z -- --version` or `package.json`).
2. **Pull Requests**:
   - Create a feature branch (`git checkout -b feat/my-change`).
   - Ensure `npm run test`, `npm run integration`, and `npm run build` succeed.
   - Describe template impacts (e.g., “affects JSX + Ionic TS only”).
   - Attach screenshots/gifs if you touched the syntax package.
3. **Code Style**:
   - Prefer `.vitriol` templates over duplicating files per variant.

## 9. Getting Help

- Join existing GitHub discussions or start a new thread if you’re unsure about architecture choices.
- When blocked on template logic, capture the generated project under `tests/temp-integration/<template>` and inspect the output to diagnose issues.
- For syntax highlighting, use the VS Code developer tools (`Developer: Inspect TM Scopes`) to debug grammar tokens.

Happy hacking! Keeping templates centralized and tests green ensures every Vitriol user gets a consistent experience across variants.
