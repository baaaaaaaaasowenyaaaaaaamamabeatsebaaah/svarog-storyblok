// src/pages/home.js
import svarogUI from 'svarog-ui';
import StoryblokApi from '../cms/storyblok.js';

const { Page, Header, Footer, Hero, BlogList } = svarogUI.default || svarogUI;

export default class HomePage {
  constructor() {
    this.storyblokApi = new StoryblokApi();
    this.element = null;
  }

  async render() {
    try {
      // Fetch site configuration and recent posts
      const [siteConfig, recentPosts] = await Promise.all([
        this.storyblokApi.getSiteConfig(),
        this.storyblokApi.getBlogPosts({ page: 1, perPage: 6 }),
      ]);

      // Create page structure
      const page = new Page({
        className: 'home-page',
      });

      // Create header
      const header = new Header({
        siteName: siteConfig.site_name,
        navigation: siteConfig.primary_navigation.map((item) => ({
          label: item.label,
          href: item.url,
          active: item.url === '/',
        })),
        logo: siteConfig.logo,
      });

      // Create hero section
      const hero = new Hero({
        title: 'Welcome to ' + siteConfig.site_name,
        subtitle: siteConfig.site_description,
        ctaText: 'Read Our Blog',
        ctaLink: '/blog',
        backgroundImage: '/images/hero-bg.jpg',
        align: 'center',
      });

      // Create recent posts section
      const recentPostsList = new BlogList({
        posts: recentPosts.stories.map((story) => this.formatBlogPost(story)),
        title: 'Recent Posts',
        columns: 3,
      });

      // Create footer
      const footer = new Footer({
        siteName: siteConfig.site_name,
        footer: siteConfig.footer_configuration,
      });

      // Assemble page
      page.appendChildren([
        header.getElement(),
        hero.getElement(),
        recentPostsList.getElement(),
        footer.getElement(),
      ]);

      this.element = page.getElement();
      return this.element;
    } catch (error) {
      console.error('Error rendering home page:', error);
      return this.renderError(error);
    }
  }

  formatBlogPost(story) {
    return {
      title: story.content.title,
      slug: story.slug,
      excerpt: story.content.excerpt,
      featuredImage: story.content.featured_image?.filename,
      publishedDate: story.content.publication_date,
      author: story.content.author,
      categories: story.content.categories,
    };
  }

  renderError(error) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-container';
    errorElement.innerHTML = `
      <h1>Error Loading Page</h1>
      <p>${error.message}</p>
      <a href="/" class="button">Return Home</a>
    `;
    return errorElement;
  }

  getElement() {
    return this.element;
  }
}
