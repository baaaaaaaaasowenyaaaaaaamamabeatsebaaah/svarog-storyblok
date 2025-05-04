// src/pages/blog.js
import svarogUI from 'svarog-ui';
import StoryblokApi from '../cms/storyblok.js';

const { Page, Header, Footer, BlogList, Pagination } = svarogUI.default || svarogUI;

export default class BlogPage {
  constructor() {
    this.storyblokApi = new StoryblokApi();
    this.element = null;
    this.currentPage = 1;
    this.postsPerPage = 9;
  }

  async render(params = {}) {
    try {
      this.currentPage = parseInt(params.page) || 1;

      // Fetch site configuration and blog posts
      const [siteConfig, blogData] = await Promise.all([
        this.storyblokApi.getSiteConfig(),
        this.storyblokApi.getBlogPosts(this.currentPage, this.postsPerPage),
      ]);

      const totalPages = Math.ceil(blogData.total / this.postsPerPage);

      // Create page structure
      const page = new Page({
        className: 'blog-page',
      });

      // Create header
      const navigation = siteConfig.navigation?.items
        ? siteConfig.navigation.items.map((item) => ({
            label: item.label,
            href: item.url,
            active: item.url === '/blog',
          }))
        : [];

      const header = new Header({
        siteName: siteConfig.siteName,
        navigation: navigation,
        logo: siteConfig.logo,
      });

      // Create blog list
      const blogList = new BlogList({
        posts: blogData.data,
        title: 'Blog Posts',
        columns: 3,
      });

      // Create pagination
      const pagination = new Pagination({
        currentPage: this.currentPage,
        totalPages: totalPages,
        onPageChange: (page) => this.navigate(`/blog?page=${page}`),
      });

      // Create footer
      const footer = new Footer({
        siteName: siteConfig.siteName,
        footer: siteConfig.footer,
      });

      // Assemble page
      page.appendChildren([
        header.getElement(),
        this.createPageHeader(),
        blogList.getElement(),
        pagination.getElement(),
        footer.getElement(),
      ]);

      this.element = page.getElement();
      return this.element;
    } catch (error) {
      console.error('Error rendering blog page:', error);
      return this.renderError(error);
    }
  }

  createPageHeader() {
    const headerSection = document.createElement('section');
    headerSection.className = 'blog-header';
    headerSection.innerHTML = `
      <div class="container">
        <h1>Our Blog</h1>
        <p>Insights, updates, and stories from our team</p>
      </div>
    `;
    return headerSection;
  }

  navigate(url) {
    // This will be handled by the router
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: { url } }));
  }

  renderError(error) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-container';
    errorElement.innerHTML = `
      <h1>Error Loading Blog</h1>
      <p>${error.message}</p>
      <a href="/" class="button">Return Home</a>
    `;
    return errorElement;
  }

  getElement() {
    return this.element;
  }
}
