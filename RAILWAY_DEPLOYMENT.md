# Railway Deployment Guide

This guide covers deploying your Svarog + Storyblok website to Railway using Express for production.

## Prerequisites

- Railway account
- GitHub account (for automatic deployments)
- Storyblok API tokens

## Project Structure

This project uses:
- Webpack for development and building static assets
- Express for production server
- Railway for hosting

## Deployment Steps

### 1. Prepare Your Repository

1. Ensure all files are committed to Git
2. Push your repository to GitHub

### 2. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the configuration

### 3. Configure Environment Variables

In Railway dashboard, add these environment variables:

```
STORYBLOK_PUBLIC_TOKEN=your_public_token
STORYBLOK_SPACE_ID=your_space_id
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.railway.app
```

Optional (if using API proxy):
```
STORYBLOK_TOKEN=your_preview_or_public_token
```

### 4. Deploy

Railway will automatically:
1. Install dependencies
2. Run the build command (`npm run build`)
3. Start the Express server (`npm start`)

## Custom Domain

To add a custom domain:

1. Go to project settings in Railway
2. Click on "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `ALLOWED_ORIGINS` environment variable

## Development Workflow

### Local Development

```bash
# Start development server with hot reload
npm run start:dev
```

### Production Build

```bash
# Build static assets
npm run build

# Start production server
npm start
```

## Monitoring and Logs

1. View logs in Railway dashboard
2. Use the `/health` endpoint for monitoring
3. Set up alerts in Railway (optional)

## Continuous Deployment

Railway automatically deploys when you push to your main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Railway automatically rebuilds and deploys

## Rollbacks

If needed, you can rollback to a previous deployment:

1. Go to Railway dashboard
2. Click on "Deployments"
3. Select a previous successful deployment
4. Click "Rollback to this deployment"

## Performance Optimization

The Express server includes:
- Compression middleware
- Helmet for security headers
- Static file caching
- CORS configuration

## Security Considerations

1. Environment variables are securely stored in Railway
2. Helmet provides security headers
3. CORS is configured for your domains
4. Optional API proxy hides Storyblok token

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Railway
   - Ensure all dependencies are listed in package.json
   - Verify Node.js version compatibility

2. **Runtime Errors**
   - Check runtime logs in Railway
   - Verify environment variables are set
   - Test locally with production build

3. **CORS Issues**
   - Update ALLOWED_ORIGINS environment variable
   - Check Storyblok CORS settings

### Health Check

Use the `/health` endpoint to verify the server is running:

```bash
curl https://yourdomain.railway.app/health
```

## Advanced Configuration

### Scaling

Railway automatically handles scaling, but you can:
1. Adjust instance size in project settings
2. Configure multiple replicas (paid plans)

### Custom Headers

Modify `server.js` to add custom headers:

```javascript
app.use((req, res, next) => {
  res.setHeader('X-Custom-Header', 'value');
  next();
});
```

### Caching Strategy

The current setup includes:
- 1 year cache for static assets
- No cache for HTML files
- ETag support

Modify in `server.js` as needed.

## Support

- Railway Documentation: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Project Issues: Create an issue in your GitHub repository