import { initializeStoryblok } from './cms/storyblok.js';
import { initRouter } from './router/router.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set the default theme
  document.body.classList.add('site-theme');

  // Initialize Storyblok
  initializeStoryblok();

  // Initialize the router
  initRouter();

  console.log('Svarog Storyblok site template initialized');
});
