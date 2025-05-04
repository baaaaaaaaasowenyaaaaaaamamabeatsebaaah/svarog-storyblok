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
        this.storyblokApi.getSiteConfiguration(),
        this.storyblokApi.getBlogPostBySlug(slug),
      ]);

      if (!blogPost) {
        throw new Error('Blog post not found');
      }

      // Fetch related posts
      const relatedPosts = await this.storyblokApi.getBlogPosts({
        page: 1,
        perPage: 3,
        exclude: blogPost.uuid,
      });

      // Create page structure
      const page = new Page({
        className: 'blog-detail-page',
      });

      // Create header
      const header = new Header({
        siteName: siteConfig.site_name,
        navigation: siteConfig.primary_navigation.map((item) => ({
          label: item.label,
          href: item.url,
          active: false,
        })),
        logo: siteConfig.logo,
      });

      // Create blog detail
      const blogDetail = new BlogDetail({
        title: blogPost.content.title,
        content: blogPost.content.content,
        featuredImage: blogPost.content.featured_image?.filename,
        publishedDate: blogPost.content.publication_date,
        author: blogPost.content.author,
        categories: blogPost.content.categories,
      });

      // Create related posts section
      const relatedPostsSection = this.createRelatedPostsSection(relatedPosts.stories);

      // Create footer
      const footer = new Footer({
        siteName: siteConfig.site_name,
        footer: siteConfig.footer_configuration,
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
    if (!relatedPosts.length) return null;

    const section = document.createElement('section');
    section.className = 'related-posts';

    const blogList = new BlogList({
      posts: relatedPosts.map((story) => this.formatBlogPost(story)),
      title: 'Related Posts',
      columns: 3,
    });

    section.appendChild(blogList.getElement());
    return section;
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
