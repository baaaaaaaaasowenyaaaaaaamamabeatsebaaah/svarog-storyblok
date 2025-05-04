# Setup Guide

## Quick Start

1. **Clean Installation**:

   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

## Using svarog-ui 1.1.0

The project now uses `svarog-ui` version 1.1.0, published 2 days ago.

### Import Pattern

All svarog-ui components should be imported like this:

```javascript
import { Button, Card, Header } from 'svarog-ui';
```

### Available Components

Based on the svarog-ui documentation, you can import:

- `Page`
- `Header`
- `Footer`
- `Hero`
- `BlogList`
- `BlogDetail`
- `BlogCard`
- `Pagination`
- And many more...

### Theme Management

```javascript
import { switchTheme } from 'svarog-ui';

// Switch themes
switchTheme('default');
```

## Project Structure

```
src/
├── cms/                # Storyblok integration
├── pages/              # Page components using svarog-ui
├── router/             # Client-side routing
├── styles/             # CSS with svarog-ui theme support
├── utils/              # Utility functions
└── index.js            # Main entry point
```

## Development Commands

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Deployment

The project is configured for Railway deployment with Express server. See `RAILWAY_DEPLOYMENT.md` for details.
