// tests/setup.js
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

// Mock window.location
const mockLocation = {
  href: 'http://localhost:3000/',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock window.history
const mockHistory = {
  pushState: vi.fn(),
  replaceState: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true,
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Add custom test utilities
global.mockFetch = (data, options = {}) => {
  const { status = 200, delay = 0 } = options;

  return global.fetch.mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: status >= 200 && status < 300,
          status,
          json: () => Promise.resolve(data),
          text: () => Promise.resolve(JSON.stringify(data)),
        });
      }, delay);
    });
  });
};

global.mockFetchError = (message = 'Network error', delay = 0) => {
  return global.fetch.mockImplementation(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, delay);
    });
  });
};
