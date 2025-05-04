// src/pages/home.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from './home.js';

describe('HomePage', () => {
  let homePage;

  beforeEach(() => {
    vi.clearAllMocks();
    homePage = new HomePage();
  });

  it('should create an instance', () => {
    expect(homePage).toBeInstanceOf(HomePage);
  });

  it('should render successfully with mock data', async () => {
    // Mock Storyblok API responses
    const mockSiteConfig = {
      site_name: 'Test Site',
      site_description: 'A test site',
      primary_navigation: [
        { label: 'Home', url: '/' },
        { label: 'Blog', url: '/blog' },
      ],
      footer_configuration: {
        copyright: '© 2025 Test Site',
        links: [],
        social: [],
      },
    };

    const mockBlogPosts = {
      stories: [
        {
          content: {
            title: 'Test Post 1',
            excerpt: 'Test excerpt 1',
            publication_date: '2025-01-01',
            author: 'Test Author',
          },
          slug: 'test-post-1',
        },
        {
          content: {
            title: 'Test Post 2',
            excerpt: 'Test excerpt 2',
            publication_date: '2025-01-02',
            author: 'Test Author',
          },
          slug: 'test-post-2',
        },
      ],
    };

    // Mock the API calls
    vi.spyOn(homePage.storyblokApi, 'getSiteConfiguration').mockResolvedValue(
      mockSiteConfig
    );
    vi.spyOn(homePage.storyblokApi, 'getBlogPosts').mockResolvedValue(
      mockBlogPosts
    );

    const element = await homePage.render();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('page')).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    // Mock API error
    vi.spyOn(homePage.storyblokApi, 'getSiteConfiguration').mockRejectedValue(
      new Error('API Error')
    );

    const element = await homePage.render();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('error-container')).toBe(true);
    expect(element.textContent).toContain('Error Loading Page');
  });

  it('should format blog posts correctly', () => {
    const mockStory = {
      content: {
        title: 'Test Post',
        excerpt: 'Test excerpt',
        featured_image: { filename: 'test.jpg' },
        publication_date: '2025-01-01',
        author: 'Test Author',
        categories: ['Tech', 'News'],
      },
      slug: 'test-post',
    };

    const formattedPost = homePage.formatBlogPost(mockStory);

    expect(formattedPost).toEqual({
      title: 'Test Post',
      slug: 'test-post',
      excerpt: 'Test excerpt',
      featuredImage: 'test.jpg',
      publishedDate: '2025-01-01',
      author: 'Test Author',
      categories: ['Tech', 'News'],
    });
  });
});
