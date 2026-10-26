# Wrenmoor Orders

Wrenmoor Orders is the order-management dashboard of Wrenmoor Supply Co., a wholesale distributor of café and kitchen supplies. Operations staff use it to follow orders across three warehouses, find and export orders, cancel open ones, and look up customers.

Wrenmoor Supply Co. is fictional. So are its customers, people, addresses and orders.

## The SAGE showcase

This repository is the showcase app for [Vispero SAGE](https://sage.vispero.com/docs/), which scans web apps for accessibility issues. It installs the published `@vispero/sage` from npm, the way a customer's project does.

## Stack

- npm workspaces. The app is at the repository root. Wrenmoor's design system is in `packages/ui`, as the `@wrenmoor/ui` package, which the app uses as a built package.
- [Vite](https://vite.dev/), [React](https://react.dev/) and TypeScript. The design system builds with Vite's library mode.
- [React Router](https://reactrouter.com/), with its routes declared as objects in `src/router.tsx`.
- [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/) for logic and components.
- [Playwright Test](https://playwright.dev/) for user flows in the browser.
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting.
- GitHub Actions for CI.

## Requirements

- Node.js 22.18 or later. `.nvmrc` names the version CI uses.
- npm.
- Google Chrome, for SAGE scans.

## Run it

```sh
npm install
npm run dev
```

`npm run dev` builds `@wrenmoor/ui` first, then serves the app at http://localhost:5173.

The app uses the design system's build in `packages/ui/dist/`, not its source. After you change `packages/ui`, run `npm run build:ui`. The dev server serves the new build on the next page load.

`npm run build` builds the design system, then the app into `dist/`. `npm run preview` serves the app's build at http://localhost:4173.

## Test it

```sh
npm run typecheck
npm run lint
npm test
```

`npm test` runs the design system's Vitest suite, then the app's, once. `npm run test:watch` keeps the app's running.

The Playwright tests need Playwright's Chromium once per machine:

```sh
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` builds the app, serves the build on port 4173 and runs the tests against it.

## Scan it with SAGE

A scan needs a SAGE account. Sign in once on the machine:

```sh
npx sage auth login
```

In CI, set `SAGE_TOKEN` to a CI token instead. [Accounts](https://sage.vispero.com/docs/accounts/) covers both.

Start the app, then scan it in a second terminal:

```sh
npm run dev
npx sage scan
```

`sage.config.ts` sets the app's address and the pages to scan. The scan prints a summary, writes its results to `.sage/runs/`, and exits with code 1 when it finds new issues. [Baselines and the gate](https://sage.vispero.com/docs/baselines/) explains how to accept the issues a project has today.

`vite.config.ts` registers SAGE's source stamps plugin, so each finding names the file and line to fix. The plugin stamps the app's own markup, not the design system's build. The dev server always stamps pages. A build stamps them only when asked:

```sh
SAGE_SOURCE_STAMPS=1 npm run build
npm run preview
npx sage scan --base-url http://localhost:4173
```

A coding agent can scan the pages it opens, such as after it opens a menu or a dialog, through SAGE's MCP server. See [Coding agents](https://sage.vispero.com/docs/agents/).

## Project layout

| Path | Holds |
| --- | --- |
| `packages/ui/` | `@wrenmoor/ui`, the design system: theme tokens, base styles, and the buttons, fields, select, dialog, cards and icons the pages share |
| `src/components/` | The app's own components: the app shell, page headers, stat cards and order status badges |
| `src/routes/` | One file per page, named after its URL, such as `orders/[id].tsx` for `/orders/:id` |
| `src/router.tsx` | The routes, mapping each URL to its page |
| `src/data/` | The sample customers, products and orders, and their types |
| `src/lib/` | Formatting, order logic, CSV export and downloads |
| `src/state/` | The orders store the pages read and update |
| `e2e/` | The Playwright tests |
