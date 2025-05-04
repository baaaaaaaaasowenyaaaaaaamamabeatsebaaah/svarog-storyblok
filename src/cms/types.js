/**
 * @typedef {Object} BlogPost
 * @property {string} id - Post ID
 * @property {string} title - Post title
 * @property {string} slug - Post URL slug
 * @property {string} excerpt - Post excerpt
 * @property {string} content - Post content as HTML
 * @property {string} featuredImage - Featured image URL
 * @property {Array<Category>} categories - Post categories
 * @property {string} author - Post author
 * @property {string} publishedDate - Publication date
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Category ID
 * @property {string} name - Category name
 * @property {string} slug - Category slug
 */

/**
 * @typedef {Object} SiteConfig
 * @property {string} id - Configuration ID
 * @property {string} siteName - Site name
 * @property {string} siteDescription - Site description
 * @property {string} logo - Logo URL
 * @property {Object} navigation - Site navigation
 * @property {Object} footer - Footer configuration
 */

export const ContentTypes = {
  BLOG_POST: 'blog_post',
  CATEGORY: 'category',
  SITE_CONFIG: 'site_configuration',
  NAVIGATION_ITEM: 'navigation_item',
};
