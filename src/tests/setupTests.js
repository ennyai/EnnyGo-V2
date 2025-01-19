import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
class IntersectionObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}
window.IntersectionObserver = IntersectionObserver;

// Mock ResizeObserver
class ResizeObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}
window.ResizeObserver = ResizeObserver; 