import { vi } from 'vitest';

// Set up environment variables
process.env.STRAVA_VERIFY_TOKEN = 'test-verify-token';
process.env.SUPABASE_URL = 'https://test-project.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

// Create mock functions
const mockFrom = vi.fn();

// Set up default mock implementations
const defaultMockResponse = {
  data: {
    user_id: '123',
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_at: Date.now() + 3600,
    athlete_id: '456'
  }
};

// Set up mock chain
const mockChain = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue(defaultMockResponse),
  insert: vi.fn().mockResolvedValue({ data: { id: '789' } })
};

mockFrom.mockReturnValue(mockChain);

// Export mocks
export const mocks = {
  supabase: {
    from: mockFrom,
    chain: mockChain
  },
  stravaService: {
    getActivity: vi.fn(),
    updateActivityTitle: vi.fn(),
    generateCreativeTitle: vi.fn()
  }
};

// Set up mocks
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: mockFrom
  })
}));

vi.mock('../../services/strava', () => ({
  StravaService: mocks.stravaService
}));
