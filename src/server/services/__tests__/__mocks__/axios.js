import { vi } from 'vitest';

const mockGet = vi.fn();
const mockPut = vi.fn();
const mockPost = vi.fn();

const axios = {
  get: mockGet,
  put: mockPut,
  post: mockPost
};

export default axios;
