import { vi } from 'vitest';

const defaultMockResponse = {
  data: {
    user_id: '123',
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_at: Date.now() + 3600,
    athlete_id: '456'
  }
};

export const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(defaultMockResponse),
    insert: vi.fn().mockResolvedValue({ data: { id: '789' } })
  })
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

vi.mock('../../services/strava', () => ({
  StravaService: {
    getActivity: vi.fn(),
    updateActivityTitle: vi.fn(),
    generateCreativeTitle: vi.fn()
  }
}));

// Set up environment variables
process.env.STRAVA_VERIFY_TOKEN = 'test-verify-token';
process.env.SUPABASE_URL = 'https://test-project.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
