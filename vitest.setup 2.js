import { vi } from 'vitest';

// Mock environment variables
process.env.SUPABASE_URL = 'https://test-project.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.STRAVA_CLIENT_ID = 'test-client-id';
process.env.STRAVA_CLIENT_SECRET = 'test-client-secret';
process.env.STRAVA_VERIFY_TOKEN = 'test-verify-token';

// Initialize mock functions
const mockAxios = {
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn()
};

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis()
};

// Set up global mocks
global.mockAxios = mockAxios;
global.mockSupabase = mockSupabase;

// Mock modules
vi.mock('axios', () => mockAxios);
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

// Mock StravaService
const mockStravaService = {
  getActivity: vi.fn().mockResolvedValue({
    id: '123456',
    name: 'Test Activity',
    type: 'Run',
    start_date: '2024-03-20T10:00:00Z'
  }),
  updateActivityTitle: vi.fn().mockResolvedValue(true)
};

// Setup mocks
vi.mock('./src/server/services/strava', () => ({
  StravaService: mockStravaService
}));

global.mockStravaService = mockStravaService; 