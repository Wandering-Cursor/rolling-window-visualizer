# rolling-window-visualizer

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## CI & Deployment

- Pull requests run CI via GitHub Actions:
  - Lint (`npm run lint:eslint`), type-check, and build.
- Pushes to `main` build and deploy to GitHub Pages.

### GitHub Pages setup

- Ensure Pages is enabled: Settings → Pages → Source: "GitHub Actions".
- The workflow builds with Vite `base` set to `/rolling-window-visualizer/`.
- Deploy workflow files:
  - `.github/workflows/ci.yml` — PR lint/type-check/build.
  - `.github/workflows/deploy.yml` — Build on `main` and deploy `dist`.

### Notes

- Node versions supported: `^20.19.0 || >=22.12.0`; workflows use Node 22.
- Local preview of production build:

```sh
npm run build
npm run preview
```
