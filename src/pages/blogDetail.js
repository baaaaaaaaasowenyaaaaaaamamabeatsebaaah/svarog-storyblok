// src/pages/blogDetail.js
import svarogUI from 'svarog-ui';
import StoryblokApi from '../cms/storyblok.js';

const { Page, Header, Footer, BlogDetail, BlogList } = svarogUI.default || svarogUI;

export default class BlogDetailPage {
  constructor() {
    this.storyblokApi = new StoryblokApi();
    this.element = null;
  }

  async render(params = {}) {
    try {
      const { slug } = params;

      if (!slug) {
        throw new Error('Blog post slug is required');
      }

      // Fetch site configuration and blog post
      const [siteConfig, blogPost] = await Promise.all([
        this.storyblokApi.getSiteConfig(),
        this.storyblokApi.getBlogPostBySlug(slug),
      ]);

      if (!blogPost) {
        throw new Error('Blog post not found');
      }

      // Fetch related posts
      const relatedPosts = await this.storyblokApi.getBlogPosts(1, 3);

      // Create page structure
      const page = new Page({
        className: 'blog-detail-page',
      });

      // Create header
      const navigation = siteConfig.navigation?.items
        ? siteConfig.navigation.items.map((item) => ({
            label: item.label,
            href: item.url,
            active: false,
          }))
        : [];

      const header = new Header({
        siteName: siteConfig.siteName,
        navigation: navigation,
        logo: siteConfig.logo,
      });

      // Create blog detail
      const blogDetail = new BlogDetail(blogPost);

      // Create related posts section
      const relatedPostsSection = this.createRelatedPostsSection(relatedPosts.data);

      // Create footer
      const footer = new Footer({
        siteName: siteConfig.siteName,
        footer: siteConfig.footer,
      });

      // Assemble page
      page.appendChildren([
        header.getElement(),
        blogDetail.getElement(),
        relatedPostsSection,
        footer.getElement(),
      ]);

      this.element = page.getElement();
      return this.element;
    } catch (error) {
      console.error('Error rendering blog detail page:', error);
      return this.renderError(error);
    }
  }

  createRelatedPostsSection(relatedPosts) {
    if (!relatedPosts || !relatedPosts.length) return null;

    const section = document.createElement('section');
    section.className = 'related-posts';

    const blogList = new BlogList({
      posts: relatedPosts,
      title: 'Related Posts',
      columns: 3,
    });

    section.appendChild(blogList.getElement());
    return section;
  }

  renderError(error) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-container';
    errorElement.innerHTML = `
      <h1>Error Loading Blog Post</h1>
      <p>${error.message}</p>
      <a href="/blog" class="button">Back to Blog</a>
    `;
    return errorElement;
  }

  getElement() {
    return this.element;
  }
}
