import StoryblokClient from 'storyblok-js-client';
import { storyblokInit, apiPlugin } from '@storyblok/js';

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
   * Get site configuration
   * @returns {Promise<Object>} Site configuration
   */
  async getSiteConfig() {
    try {
      console.log('Fetching site configuration...');

      // Log the request details
      console.log('Request details:', {
        url: 'cdn/stories/config',
        token: process.env.NODE_ENV === 'production' ? 'PUBLIC_TOKEN' : 'PREVIEW_TOKEN',
        environment: process.env.NODE_ENV,
      });

      const response = await this.client.get('cdn/stories/config', {
        version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
      });

      console.log('Site configuration response:', response);
      console.log('Story content fields:', Object.keys(response.data.story.content));

      if (!response.data.story) {
        throw new Error(
          'Site configuration story not found. Please create a story with slug "config" in Storyblok.'
        );
      }

      return this.transformSiteConfig(response.data.story);
    } catch (error) {
      console.error('Error fetching site configuration:', error);
      console.error('Full error object:', error);

      // Check if it's a 404 error
      if (error.response && error.response.status === 404) {
        console.error('\n❌ Site configuration not found!');
        console.error('Please create a story with the slug "config" in your Storyblok space.');
      } else if (error.response && error.response.status === 401) {
        console.error('\n❌ Authentication error!');
        console.error('Please check your Storyblok API token.');
      }

      throw error;
    }
  }

  /**
   * Transform Storyblok site configuration to app format
   * @param {Object} story - Storyblok story
   * @returns {Object} Transformed site configuration
   */
  transformSiteConfig(story) {
    const content = story.content;

    console.log('Raw site config content:', JSON.stringify(content, null, 2));

    // The actual site configuration is nested in the body array
    let siteConfig = content;

    // Check if the configuration is nested in a body array
    if (content.body && Array.isArray(content.body) && content.body.length > 0) {
      // Find the Site Configuration component in the body array
      const configComponent = content.body.find((item) => item.component === 'Site Configuration');
      siteConfig = configComponent || content.body[0]; // Fallback to first item if not found
    }

    // Extract fields from the site configuration
    const siteName = siteConfig.SiteName || 'Default Site Name';
    const siteDescription = siteConfig.SiteDescription || '';
    const logo = siteConfig.Logo?.filename || null;

    // Transform navigation
    let navigationItems = [];

    if (siteConfig.PrimaryNavigation && Array.isArray(siteConfig.PrimaryNavigation)) {
      navigationItems = siteConfig.PrimaryNavigation.map((item) => {
        // Extract URL from the multilink field
        let url = '/';
        if (item.URL) {
          if (item.URL.cached_url) {
            url = '/' + item.URL.cached_url;
          } else if (item.URL.url) {
            url = item.URL.url;
          }
        }

        return {
          label: item.Label || 'Unknown',
          url: url,
        };
      });
    }

    const navigation = { items: navigationItems };

    // Transform footer navigation if available
    let footerLinks = [];

    if (siteConfig.FooterNavigation && Array.isArray(siteConfig.FooterNavigation)) {
      footerLinks = siteConfig.FooterNavigation.map((item) => {
        let url = '/';
        if (item.URL) {
          if (item.URL.cached_url) {
            url = '/' + item.URL.cached_url;
          } else if (item.URL.url) {
            url = item.URL.url;
          }
        }

        return {
          label: item.Label || 'Unknown',
          url: url,
        };
      });
    }

    const footer = {
      copyright: `© ${new Date().getFullYear()} ${siteName}`,
      links: footerLinks,
      social: [], // Add social links if available in your Storyblok configuration
    };

    const result = {
      id: story.uuid,
      siteName: siteName,
      siteDescription: siteDescription,
      logo: logo,
      navigation: navigation,
      footer: footer,
    };

    console.log('Transformed site config:', JSON.stringify(result, null, 2));

    return result;
  }
}
