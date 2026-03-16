# Aurora React

Component library for the Aurora Design System, built with React, TypeScript,
and Storybook.

## 🔗 Quick Links

- [CI/CD Pipeline](./CI_CD_PIPELINE.md)
- [Infrastructure Architecture](./cfn/README.md)
- [Manual Deployment Guide](./cfn/DEPLOYMENT.md)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev                 # Vite dev server on http://localhost:5173

# Run Storybook
npm run storybook          # Storybook UI on http://localhost:6006
```

## 🧪 Testing

**First-time setup:**

```bash
npm run test:setup         # Install Playwright browser dependencies
```

**Run tests:**

```bash
npm test                   # Run all tests in watch mode
npm run test:unit          # Unit/component tests only
npm run test:storybook     # Storybook interaction tests only
npm run test:visual        # Visual Regression tests only
npm run test:visual:report # Visual Regression tests only and open HTML report in Vitest UI
npm run test:visual:update # Update the Visual Regression tests baseline screenshots
npm run coverage           # Generate coverage report
```

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite (with Rolldown)
- **Testing**: Vitest + Playwright
- **Storybook**: v10 with component documentation
- **Design Tokens**: `@worldline/aurora-design-tokens`
- **Publishing**: Semantic Release (automated versioning)

## 📦 Build & Release

```bash
npm run build              # Build library for production
npm run lint               # Check code quality
npm run lint:fix           # Auto-fix linting issues
```

**Releases are automated via Jenkins pipeline:**

- `develop` branch → Semantic release → Auto-PR to master
- `master` branch → Deploy Storybook to AWS

See [CI_CD_PIPELINE.md](./CI_CD_PIPELINE.md) for pipeline details.

## ☁️ Infrastructure

Storybook is deployed to AWS with:

- **S3 + CloudFront** for static hosting
- **ACM certificate + custom domain**
  (storybook.aurora.example.com,
  storybook.aurora.example.com)
- **WAFv2 IP whitelist** for access control (office/VPN only)
- **Multi-region deployment** (us-east-1 for WAF/ACM, eu-west-1 for S3)

See [cfn/README.md](./cfn/README.md) for infrastructure architecture.

## 📚 Documentation

- **[CI/CD Pipeline](./CI_CD_PIPELINE.md)** - Jenkins pipeline stages, branch
  strategy, troubleshooting
- **[Infrastructure Architecture](./cfn/README.md)** - CloudFormation stacks,
  security, multi-region setup
- **[Manual Deployment Guide](./cfn/DEPLOYMENT.md)** - Step-by-step
  infrastructure deployment
