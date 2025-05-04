// src/utils/dom.js

/**
 * Creates a DOM element with given attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text content
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('data')) {
      element.setAttribute(key, value);
    } else if (key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  // Add children
  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === 'string') {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof Node) {
    element.appendChild(children);
  }

  return element;
}

/**
 * Removes all children from an element
 * @param {HTMLElement} element
 */
export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Adds event listener with automatic cleanup
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} handler
 * @returns {Function} Cleanup function
 */
export function addEventListenerWithCleanup(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Checks if element is in viewport
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function for performance optimization
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Safely parse JSON with fallback
 * @param {string} json
 * @param {*} fallback
 * @returns {*}
 */
export function safeJsonParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
    return fallback;
  }
}

/**
 * Get CSS custom property value
 * @param {string} propertyName
 * @param {HTMLElement} element
 * @returns {string}
 */
export function getCSSCustomProperty(
  propertyName,
  element = document.documentElement
) {
  return getComputedStyle(element).getPropertyValue(propertyName).trim();
}

/**
 * Set CSS custom property value
 * @param {string} propertyName
 * @param {string} value
 * @param {HTMLElement} element
 */
export function setCSSCustomProperty(
  propertyName,
  value,
  element = document.documentElement
) {
  element.style.setProperty(propertyName, value);
}

/**
 * Wait for DOM content to be loaded
 * @returns {Promise}
 */
export function domReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * Load script dynamically
 * @param {string} src
 * @param {Object} attributes
 * @returns {Promise}
 */
export function loadScript(src, attributes = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

/**
 * Load CSS dynamically
 * @param {string} href
 * @returns {Promise}
 */
export function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = resolve;
    link.onerror = reject;

    document.head.appendChild(link);
  });
}
