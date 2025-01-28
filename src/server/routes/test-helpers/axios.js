import { vi } from 'vitest';

// Create mock axios instance
const mockAxios = {
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
  create: vi.fn().mockReturnThis(),
  defaults: { baseURL: '', headers: {} }
};

// Setup mock implementations
mockAxios.get.mockImplementation((url, config) => {
  if (!config?.headers?.Authorization) {
    return Promise.reject({
      response: { data: { message: 'Authorization Error' } }
    });
  }
  return Promise.resolve({
    data: {
      id: '123456',
      name: 'Test Activity',
      type: 'Run',
      distance: 5000,
      moving_time: 1800,
      average_speed: 2.78,
      total_elevation_gain: 100,
      start_date: '2024-03-20T10:00:00Z'
    }
  });
});

mockAxios.put.mockImplementation((url, data, config) => {
  if (!config?.headers?.Authorization) {
    return Promise.reject({
      response: { data: { message: 'Authorization Error' } }
    });
  }
  return Promise.resolve({
    data: {
      id: '123456',
      name: data.name,
      type: 'Run',
      distance: 5000,
      moving_time: 1800,
      average_speed: 2.78,
      total_elevation_gain: 100,
      start_date: '2024-03-20T10:00:00Z'
    }
  });
});

mockAxios.post.mockImplementation((url, data, config) => {
  if (!config?.headers?.Authorization) {
    return Promise.reject({
      response: { data: { message: 'Authorization Error' } }
    });
  }
  return Promise.resolve({
    data: {
      id: '123456',
      ...data,
      start_date: '2024-03-20T10:00:00Z'
    }
  });
});

export default mockAxios;
