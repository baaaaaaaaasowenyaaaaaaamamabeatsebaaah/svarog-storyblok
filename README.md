# Svarog + Storyblok Website

A modern website built with the Svarog component library and Storyblok headless CMS.

## Features

- 🛠️ Built with vanilla JavaScript (no framework dependencies)
- 🎨 Theme system powered by CSS variables
- 📱 Fully responsive design
- 📝 Blog functionality with Storyblok CMS
- 🚀 Modern build pipeline with Webpack 5
- 🧪 Test coverage with Vitest
- 🔍 ESLint and Prettier for code quality

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Storyblok account with API access

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd svarog-storyblok-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Storyblok credentials:
   ```
   STORYBLOK_PREVIEW_TOKEN=your_preview_token
   STORYBLOK_PUBLIC_TOKEN=your_public_token
   STORYBLOK_SPACE_ID=your_space_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Visit http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server with Webpack
- `npm start` - Start production server with Express
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run deploy` - Build and start production server

## Project Structure

```
svarog-storyblok-site/
├── public/                 # Static assets
├── src/
│   ├── cms/               # Storyblok integration
│   ├── pages/             # Page components
│   ├── router/            # Client-side routing
│   ├── styles/            # CSS styles and themes
│   ├── utils/             # Utility functions
│   ├── app.js             # Main application setup
│   └── index.js           # Entry point
├── tests/                 # Test files
└── [config files]         # Configuration files
```

## Storyblok Setup

### Content Types Required

1. **Blog Post**
   - title (Text)
   - slug (Text/Slug)
   - content (Rich Text)
   - excerpt (Textarea)
   - featured_image (Asset)
   - categories (Multilink)
   - author (Text)
   - publication_date (Date/Time)

2. **Site Configuration**
   - site_name (Text)
   - site_description (Textarea)
   - logo (Asset)
   - primary_navigation (Table/Blocks)
   - footer_configuration (Table/Blocks)

3. **Navigation Item**
   - label (Text)
   - url (Text)

### Storyblok Visual Editor

1. Set the preview URL in Storyblok settings to: `http://localhost:3000/`
2. Enable the Storyblok bridge by appending `?_storyblok=[story_id]` to preview URLs
3. Configure webhooks for content updates if needed

## Deployment

### Railway (Recommended)

This project is configured for deployment on Railway with Express:

1. Push your repository to GitHub
2. Create a new project on Railway
3. Connect your GitHub repository
4. Add environment variables:
   - `STORYBLOK_PUBLIC_TOKEN`
   - `STORYBLOK_SPACE_ID`
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS`
5. Deploy!

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed instructions.

### Netlify

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify UI
4. Deploy!

### Vercel

1. Import your repository to Vercel
2. Configure build settings (should be auto-detected)
3. Add environment variables in Vercel UI
4. Deploy!

## Theme Customization

The site uses CSS variables for theming. To customize the theme:

1. Edit `src/styles/site-theme.css`
2. Override Svarog default variables
3. Add your own custom variables

Example:
```css
.site-theme {
  --color-brand-primary: #your-color;
  --font-family-primary: 'Your Font', sans-serif;
}
```

## Component Usage

All components are from the Svarog library. Key components used:

- `Header` - Site header with navigation
- `Footer` - Site footer
- `BlogCard` - Blog post preview card
- `BlogList` - List of blog posts
- `BlogDetail` - Single blog post view
- `Hero` - Hero section
- `Pagination` - Page navigation

## Testing

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and feature requests, please open an issue in the repository.