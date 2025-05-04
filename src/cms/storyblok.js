import StoryblokClient from 'storyblok-js-client';
import { storyblokInit, apiPlugin } from '@storyblok/js';
import { renderRichText } from '@storyblok/js';

// Initialize Storyblok client
const client = new StoryblokClient({
  accessToken:
    process.env.NODE_ENV === 'production'
      ? process.env.STORYBLOK_PUBLIC_TOKEN
      : process.env.STORYBLOK_PREVIEW_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory',
  },
  region: 'eu', // or 'us' depending on your Storyblok account region
});

/**
 * Initialize Storyblok
 */
export function initializeStoryblok() {
  // Initialize Storyblok JS SDK
  storyblokInit({
    accessToken:
      process.env.NODE_ENV === 'production'
        ? process.env.STORYBLOK_PUBLIC_TOKEN
        : process.env.STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: 'eu', // or 'us' depending on your Storyblok account region
    },
  });

  // Add Storyblok Bridge for live preview in development
  if (process.env.NODE_ENV !== 'production') {
    const script = document.createElement('script');
    script.src = '//app.storyblok.com/f/storyblok-v2-latest.js';
    document.head.appendChild(script);

    script.onload = () => {
      const { StoryblokBridge } = window;

      if (StoryblokBridge) {
        const storyblokInstance = new StoryblokBridge({
          preventClicks: true,
        });

        storyblokInstance.on(['published', 'change'], () => {
          window.location.reload();
        });
      }
    };
  }
}

/**
 * CMS API integration for fetching content from Storyblok
 */
export default class StoryblokApi {
  constructor() {
    this.client = client;
  }

  /**
   * Get blog posts with pagination
   * @param {number} page - Page number (1-based)
   * @param {number} perPage - Items per page
   * @returns {Promise<Object>} Blog posts response
   */
  async getBlogPosts(page = 1, perPage = 10) {
    try {
      const response = await this.client.get('cdn/stories', {
        starts_with: 'blog/',
        is_startpage: false,
        per_page: perPage,
        page,
        sort_by: 'content.publication_date:desc',
      });

      return {
        data: this.transformStories(response.data.stories),
        total: response.total,
        perPage,
        page,
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by slug
   * @param {string} slug - Post slug
   * @returns {Promise<Object>} Blog post
   */
  async getBlogPostBySlug(slug) {
    try {
      const response = await this.client.get(`cdn/stories/blog/${slug}`, {
        version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
      });

      return this.transformStory(response.data.story);
    } catch (error) {
      console.error(`Error fetching blog post with slug "${slug}":`, error);
      throw error;
    }
  }

  /**
   * Get site configuration
   * @returns {Promise<Object>} Site configuration
   */
  async getSiteConfig() {
    try {
      console.log('Fetching site configuration...');
      const response = await this.client.get('cdn/stories/config', {
        version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
      });
      console.log('Site configuration response:', response);

      if (!response.data.story) {
        throw new Error(
          'Site configuration story not found. Please create a story with slug "config" in Storyblok.'
        );
      }

      return this.transformSiteConfig(response.data.story);
    } catch (error) {
      console.error('Error fetching site configuration:', error.message);
      console.error('Details:', {
        url: 'cdn/stories/config',
        spaceId: process.env.STORYBLOK_SPACE_ID,
        hasToken: !!process.env.STORYBLOK_PREVIEW_TOKEN,
        environment: process.env.NODE_ENV,
      });

      // Check if it's a 404 error
      if (error.response && error.response.status === 404) {
        console.error('\n❌ Site configuration not found!');
        console.error('Please create a story with the slug "config" in your Storyblok space.');
        console.error('This story should contain your site configuration data.');
      }

      throw error;
    }
  }

  /**
   * Transform Storyblok stories to app format
   * @param {Array} stories - Storyblok stories
   * @returns {Array} Transformed stories
   */
  transformStories(stories) {
    return stories.map((story) => this.transformStory(story));
  }

  /**
   * Transform a Storyblok story to app format
   * @param {Object} story - Storyblok story
   * @returns {Object} Transformed story
   */
  transformStory(story) {
    const content = story.content;

    // Transform categories if available
    const categories = content.categories
      ? content.categories.map((cat) => {
          return {
            id: cat.id,
            name: cat.name || cat.slug,
            slug: cat.slug,
          };
        })
      : [];

    // Transform featured image if available
    const featuredImage = content.featured_image ? content.featured_image.filename : null;

    // Transform rich text content to HTML
    const contentHtml = content.content ? renderRichText(content.content) : '';

    return {
      id: story.uuid,
      title: content.title,
      slug: story.slug,
      excerpt: content.excerpt || '',
      content: contentHtml,
      featuredImage: featuredImage,
      categories: categories,
      author: content.author || 'Anonymous',
      publishedDate: content.publication_date || story.published_at,
    };
  }

  /**
   * Transform Storyblok site configuration to app format
   * @param {Object} story - Storyblok story
   * @returns {Object} Transformed site configuration
   */
  transformSiteConfig(story) {
    const content = story.content;

    // Transform logo if available
    const logo = content.logo ? content.logo.filename : null;

    // Transform navigation
    const navigation = {
      items:
        content.primary_navigation?.map((item) => ({
          label: item.label,
          url: item.url,
        })) || [],
    };

    // Transform footer
    const footer = {
      copyright: content.footer_copyright || `© ${new Date().getFullYear()} ${content.site_name}`,
      links:
        content.footer_links?.map((item) => ({
          label: item.label,
          url: item.url,
        })) || [],
      social:
        content.social_links?.map((item) => ({
          platform: item.platform,
          url: item.url,
        })) || [],
    };

    return {
      id: story.uuid,
      siteName: content.site_name,
      siteDescription: content.site_description || '',
      logo: logo,
      navigation: navigation,
      footer: footer,
    };
  }
}
