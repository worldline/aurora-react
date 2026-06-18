# Aurora React

Component library for the Aurora Design System, built with React, TypeScript,
and Storybook.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Import CSS files](#import-css-files)
  - [Import components](#import-components)
  - [SSR configuration](#ssr-configuration-react-router-v7--vite)
- [Contributing](#contributing)
  - [Local Development](#local-development)
  - [Testing](#testing)
  - [Icons](#icons)
  - [AI Integration](#ai-integration)
  - [Technology Stack](#technology-stack)
  - [Build & Release](#build--release)
  - [Infrastructure](#infrastructure)
- [Documentation](#documentation)

---

## Getting Started

`@worldline/aurora-react` has been tested with **React Router v7** and **Next.js
16** (App Router).

### Prerequisites

- Node.js >= 24
- React >= 19

### Installation

The package is available on a private npm registry (soon to be publicly released
on npmjs.com). Install it using npm:

```bash
npm install -S @worldline/aurora-react
```

You also need to install the required peer dependencies if they are not already
present in your project:

```bash
npm install -S classnames react-aria-components
```

### Import CSS files

To properly display Aurora components, import the CSS files in your
application's main entry file — for example, the root layout (`app/layout.tsx`
in Next.js, `app/root.tsx` in React Router):

```ts
import '@worldline/aurora-react/fonts.css'
import '@worldline/aurora-react/styles.css'
```

### Import components

Components are available as named exports from the
`@worldline/aurora-react/components` entry point:

```ts
import { Button, Card } from '@worldline/aurora-react/components'
```

### SSR configuration (React Router v7 / Vite)

When rendering Aurora components on the server side (SSR), add the following
configuration to your `vite.config.ts`. Without it, Vite will attempt to process
the CSS files imported by the library's TSX files, which causes build errors:

```ts
export default defineConfig({
  ssr: {
    noExternal: ['@worldline/aurora-react'],
  },
  // ... rest of the config
})
```

---

## Contributing

### Local Development

```bash
# Install dependencies
npm install

# Start the Vite dev server
npm run dev         # http://localhost:5173

# Start Storybook
npm run storybook   # http://localhost:6006
```

### Testing

**First-time setup:**

```bash
npm run test:setup   # Install Playwright browser dependencies
```

**Run tests:**

```bash
npm test                    # Run all tests in watch mode
npm run test:unit           # Unit and component tests only
npm run test:storybook      # Storybook interaction tests only
npm run test:visual         # Visual regression tests only
npm run test:visual:report  # Visual regression tests with HTML report
npm run test:visual:update  # Update visual regression baseline screenshots
npm run coverage            # Generate coverage report
```

### Icons

Icon components are automatically generated from SVG files using SVGR. Icons
under `src/assets/icons/basics/` that are part of
[Google Material Symbols](https://fonts.google.com/icons) can be downloaded
using the provided script:

```bash
# Download one or more icons (basics directory by default)
npm run icons:download -- heart star music_note

# Download a filled variant (append :fill)
npm run icons:download -- account_circle:fill notifications:fill
```

Icon names must match the Google Material Symbols name (snake_case). Malformed
specs such as `name:fill:extra` or `:fill` are rejected with a clear error
message. After downloading, regenerate the React components:

```bash
npm run icons:generate
```

The icon components will also be regenerated automatically when you run
`npm run storybook` or `npm run build`.

#### Custom and brand icons

The following icons are **not** part of Google Material Symbols and must be
added manually by placing the SVG file in the appropriate directory:

| Icon                   | Directory          | Reason             |
| ---------------------- | ------------------ | ------------------ |
| `check-indeterminate`  | `basics/`          | Custom minimal SVG |
| `worldline-logo-large` | `basics/`          | Brand asset        |
| `worldline-logo-small` | `basics/`          | Brand asset        |
| `pdf-file`             | `file-types/`      | Custom SVG         |
| `american-express`     | `payment-methods/` | Brand asset        |
| `mastercard`           | `payment-methods/` | Brand asset        |

When adding a custom icon manually, use these SVG settings to stay consistent
with the rest of the icon set:

- Toggle **Fill** depending on the icon variant you need
- Set **Weight** to **300**
- Set **Grade** to **0**
- Set **Optical size** to **24px**
- Set **Style** to **Material Symbols (new)** and **Rounded**

### AI Integration

You can make the Storybook accessible to your AI agents by adding the Storybook
MCP server to your project. Storybook must be running locally for the server to
be available. See the
[Storybook MCP documentation](https://storybook.js.org/docs/ai/mcp/overview#docs)
for details.

```bash
npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project
```

Once connected, you can prompt your AI agent with requests such as _"Show me how
to use the Aurora Alert component"_ or _"Create a sign-up form using Aurora
components"_.

### Technology Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Framework     | React 19 + TypeScript             |
| Build tool    | Vite (with Rolldown)              |
| Testing       | Vitest + Playwright               |
| Documentation | Storybook v10                     |
| Design tokens | `@worldline/aurora-design-tokens` |
| Versioning    | Semantic Release (automated)      |

### Build & Release

```bash
npm run build      # Build the library for production
npm run lint       # Check code quality
npm run lint:fix   # Auto-fix linting issues
```

Releases are fully automated via the Jenkins pipeline:

- `develop` branch → Semantic Release → Auto-PR to `master`
- `master` branch → Storybook deployed to AWS

See [CI_CD_PIPELINE.md](./CI_CD_PIPELINE.md) for pipeline details.

### Infrastructure

The Storybook documentation site is deployed to AWS:

- **S3 + CloudFront** for static hosting
- **ACM certificate** with custom domains
  (`storybook.aurora.example.com`,
  `storybook.aurora.example.com`)
- **WAFv2 IP allowlist** for access control (office and VPN only)
- **Multi-region deployment** (us-east-1 for WAF/ACM, eu-west-1 for S3)

See [cfn/README.md](./cfn/README.md) for the full infrastructure architecture.

---

## Documentation

| Resource                                       | Description                                                   |
| ---------------------------------------------- | ------------------------------------------------------------- |
| [CI/CD Pipeline](./CI_CD_PIPELINE.md)          | Jenkins pipeline stages, branch strategy, and troubleshooting |
| [Infrastructure Architecture](./cfn/README.md) | CloudFormation stacks, security, and multi-region setup       |
| [Manual Deployment Guide](./cfn/DEPLOYMENT.md) | Step-by-step infrastructure deployment                        |
