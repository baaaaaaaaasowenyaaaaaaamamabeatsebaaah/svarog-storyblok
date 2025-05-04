// src/index.js
import './styles/global.css';
import svarogUI from 'svarog-ui';
import { domReady } from './utils/dom.js';
import { initializeStoryblok } from './cms/storyblok.js';
import { initRouter } from './router/router.js';
import * as everything from 'svarog-ui';
console.log('svarog-ui exports:', everything);

const { switchTheme } = svarogUI.default || svarogUI;

// Initialize the app
async function initApp() {
  try {
    // Wait for DOM ready
    await domReady();

    // Apply site theme
    document.body.classList.add('site-theme');
    switchTheme('default');

    // Initialize Storyblok
    initializeStoryblok();

    // Initialize router
    initRouter();

    console.log('Svarog Storyblok site initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);

    // Show error to user
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div class="error-container">
          <h1>Failed to Load Application</h1>
          <p>${error.message}</p>
          <button onclick="window.location.reload()" class="button">Retry</button>
        </div>
      `;
    }
  }
}

// Start the app
initApp();
