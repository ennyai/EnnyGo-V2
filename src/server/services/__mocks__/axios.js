import { vi } from 'vitest';

const mockActivity = {
  id: 12345,
  name: 'Morning Run',
  type: 'Run',
  distance: 5000,
  moving_time: 1800,
  start_date: '2024-01-01T08:00:00Z',
  average_speed: 3.5,
  total_elevation_gain: 100
};

export default {
  get: vi.fn((url, config) => {
    if (!config?.headers?.Authorization) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: 'Authorization Error' }
        }
      });
    }
    return Promise.resolve({ 
      data: mockActivity,
      status: 200
    });
  }),
  
  put: vi.fn((url, data, config) => {
    if (!config?.headers?.Authorization) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: 'Authorization Error' }
        }
      });
    }
    return Promise.resolve({ 
      data: { ...mockActivity, name: data.name },
      status: 200
    });
  }),
  
  post: vi.fn((url, data, config) => {
    if (!config?.headers?.Authorization) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: 'Authorization Error' }
        }
      });
    }
    return Promise.resolve({ 
      data: { ...mockActivity, ...data },
      status: 200
    });
  }),
  
  delete: vi.fn(),
  
  create: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() }
    }
  })),
  
  defaults: {
    headers: {
      common: {},
    },
  },
}; 