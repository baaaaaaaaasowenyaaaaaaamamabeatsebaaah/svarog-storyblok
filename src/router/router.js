// src/router/router.js
import HomePage from '../pages/home.js';

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = '';
    this.appElement = document.getElementById('app');
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  async navigate(url) {
    // Prevent default navigation behavior
    window.history.pushState({}, '', url);
    await this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;
    const queryString = window.location.search;
    const params = Object.fromEntries(new URLSearchParams(queryString));

    this.currentPath = path;

    // Show loading state
    this.showLoading();

    try {
      // Match routes
      let handler = this.routes.get(path);
      let routeParams = { ...params };

      if (handler) {
        const page = new handler();
        const element = await page.render(routeParams);
        this.renderPage(element);
      } else {
        this.renderNotFound();
      }
    } catch (error) {
      console.error('Router error:', error);
      this.renderError(error);
    }
  }

  renderPage(element) {
    if (this.appElement) {
      this.appElement.innerHTML = '';
      this.appElement.appendChild(element);
    }
  }

  showLoading() {
    if (this.appElement) {
      this.appElement.innerHTML = `
        <div class="app-loading">
          <div class="app-loading-spinner"></div>
        </div>
      `;
    }
  }

  renderNotFound() {
    if (this.appElement) {
      this.appElement.innerHTML = `
        <div class="error-container">
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/" class="button">Return Home</a>
        </div>
      `;
    }
  }

  renderError(error) {
    if (this.appElement) {
      this.appElement.innerHTML = `
        <div class="error-container">
          <h1>Error</h1>
          <p>${error.message}</p>
          <a href="/" class="button">Return Home</a>
        </div>
      `;
    }
  }

  init() {
    // Add event listener for navigation
    window.addEventListener('popstate', () => this.handleRoute());

    // Handle clicks on links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        this.navigate(link.href);
      }
    });

    // Handle custom navigation events
    window.addEventListener('navigateTo', (e) => {
      this.navigate(e.detail.url);
    });

    // Initial route handling
    this.handleRoute();
  }
}

export function initRouter() {
  const router = new Router();

  // Define routes - only home page
  router.addRoute('/', HomePage);

  // Initialize router
  router.init();

  return router;
}
