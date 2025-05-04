// src/utils/formatters.js

/**
 * Format date to human readable string
 * @param {string|Date} date
 * @param {string} locale
 * @param {Object} options
 * @returns {string}
 */
export function formatDate(date, locale = 'en-US', options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale, defaultOptions);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diff = now - dateObj;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @param {string} suffix
 * @returns {string}
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  const truncated = text.substr(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substr(0, lastSpace) + suffix;
  }

  return truncated + suffix;
}

/**
 * Format file size to human readable string
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format currency
 * @param {number} amount
 * @param {string} currency
 * @param {string} locale
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format number with options
 * @param {number} number
 * @param {string} locale
 * @param {Object} options
 * @returns {string}
 */
export function formatNumber(number, locale = 'en-US', options = {}) {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Slugify text for URLs
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Extract excerpt from HTML content
 * @param {string} html
 * @param {number} maxLength
 * @returns {string}
 */
export function extractExcerpt(html, maxLength = 150) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || '';
  return truncateText(text, maxLength);
}

/**
 * Format reading time
 * @param {string} text
 * @param {number} wordsPerMinute
 * @returns {string}
 */
export function formatReadingTime(text, wordsPerMinute = 200) {
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Parse and format rich text from Storyblok
 * @param {Object} richText - Storyblok rich text object
 * @returns {string} HTML string
 */
export function formatRichText(richText) {
  if (
    typeof StoryblokClient !== 'undefined' &&
    StoryblokClient.richTextResolver
  ) {
    return StoryblokClient.richTextResolver.render(richText);
  }

  // Fallback for when Storyblok SDK is not available
  return '<div>Rich text content</div>';
}

/**
 * Format categories for display
 * @param {Array} categories
 * @returns {string}
 */
export function formatCategories(categories) {
  if (!categories || !categories.length) return '';

  return categories.map((category) => category.name || category).join(', ');
}

/**
 * Format author name
 * @param {string|Object} author
 * @returns {string}
 */
export function formatAuthor(author) {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author.name) return author.name;
  return 'Unknown Author';
}
