// src/pages/home.js
import svarogUI from 'svarog-ui';
import StoryblokApi from '../cms/storyblok.js';

const { Header, Footer, Hero } = svarogUI.default || svarogUI;

export default class HomePage {
  constructor() {
    this.storyblokApi = new StoryblokApi();
    this.element = null;
  }

  async render() {
    try {
      // Fetch site configuration
      const siteConfig = await this.storyblokApi.getSiteConfig();
      console.log('Site config loaded:', siteConfig);

      // Create a page container
      this.element = document.createElement('div');
      this.element.className = 'home-page';

      // Create header using svarog-ui Header component
      const header = new Header({
        siteName: siteConfig.siteName,
        navigation: {
          items: siteConfig.navigation.items.map((item) => ({
            label: item.label,
            url: item.url,
            href: item.url, // Header expects 'url' but Navigation expects 'href'
          })),
        },
        logo: siteConfig.logo, // Just pass the URL string
        className: '',
      });

      // Create hero using svarog-ui Hero component
      const hero = new Hero({
        title: `Welcome to ${siteConfig.siteName}`,
        subtitle: siteConfig.siteDescription,
        ctaText: 'Get Started',
        ctaLink: '#',
        backgroundImage: '/images/hero-bg.jpg',
        align: 'center',
      });

      // Create footer using svarog-ui Footer component
      const footer = new Footer({
        siteName: siteConfig.siteName,
        footer: {
          copyright: siteConfig.footer.copyright,
          links: siteConfig.footer.links,
          social: siteConfig.footer.social,
        },
        className: '',
      });

      // Append components to page
      this.element.appendChild(header.getElement());
      this.element.appendChild(hero.getElement());
      this.element.appendChild(footer.getElement());

      return this.element;
    } catch (error) {
      console.error('Error rendering home page:', error);
      return this.renderError(error);
    }
  }

  renderError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-container';
    errorDiv.innerHTML = `
      <h1>Error Loading Page</h1>
      <p>${error.message}</p>
      <button onclick="window.location.reload()" class="button">Retry</button>
    `;
    return errorDiv;
  }

  getElement() {
    return this.element;
  }
}
