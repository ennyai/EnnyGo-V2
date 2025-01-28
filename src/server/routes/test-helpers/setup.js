import { vi } from 'vitest';

// Set environment variables before any imports
process.env = {
  ...process.env,
  SUPABASE_URL: 'https://test-project.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  STRAVA_CLIENT_ID: 'test-client-id',
  STRAVA_CLIENT_SECRET: 'test-client-secret'
};

// Mock Supabase client
const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        user_id: '123',
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Date.now() + 3600,
        athlete_id: '456'
      }
    }),
    insert: vi.fn().mockResolvedValue({ data: { id: '789' } })
  })
};

// Mock axios
const mockAxios = {
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn()
};

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
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

vi.mock('axios', () => mockAxios);

vi.mock('../../services/strava', () => ({
  StravaService: mockStravaService
}));

export {
  mockSupabase,
  mockAxios,
  mockStravaService
};
