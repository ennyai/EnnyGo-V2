import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { StravaService } from '../../services/strava';
import webhookRouter from '../strava-webhook';

describe('Strava Webhook Routes', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/webhook', webhookRouter);
  });

  describe('GET /webhook (Verification)', () => {
    it('should verify webhook with correct challenge', async () => {
      const challenge = 'test-challenge';
      const response = await request(app)
        .get('/webhook')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': process.env.STRAVA_VERIFY_TOKEN,
          'hub.challenge': challenge,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 'hub.challenge': challenge });
    });

    it('should reject verification with incorrect token', async () => {
      const response = await request(app)
        .get('/webhook')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': 'wrong-token',
          'hub.challenge': 'test-challenge',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /webhook (Event Handling)', () => {
    it('should process activity creation event', async () => {
      const mockEvent = {
        object_type: 'activity',
        object_id: '987654',
        aspect_type: 'create',
        owner_id: '123456',
        subscription_id: '1',
        event_time: 1234567890,
      };

      // Mock Supabase responses
      global.mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: {
            user_id: '123',
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_at: Date.now() + 3600,
            athlete_id: '123456'
          }
        })
      });

      global.mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: {
            user_id: '123',
            watch_activities: true
          }
        })
      });

      global.mockSupabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce({
          data: { id: '789' }
        })
      });

      // Mock StravaService
      vi.spyOn(StravaService, 'getActivity').mockResolvedValueOnce({
        id: '987654',
        type: 'Run',
        distance: 5000,
        start_date: '2024-03-20T10:00:00Z'
      });

      vi.spyOn(StravaService, 'updateActivityTitle').mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/webhook')
        .send(mockEvent);

      expect(response.status).toBe(200);
      expect(global.mockSupabase.from).toHaveBeenCalledWith('strava_tokens');
      expect(StravaService.getActivity).toHaveBeenCalled();
      expect(StravaService.updateActivityTitle).toHaveBeenCalled();
    });

    it('should not process activity if watch_activities is false', async () => {
      const mockEvent = {
        object_type: 'activity',
        object_id: '987654',
        aspect_type: 'create',
        owner_id: '123456',
        subscription_id: '1',
        event_time: 1234567890,
      };

      // Mock Supabase responses
      global.mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: {
            user_id: '123',
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_at: Date.now() + 3600,
            athlete_id: '123456'
          }
        })
      });

      global.mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: {
            user_id: '123',
            watch_activities: false
          }
        })
      });

      const response = await request(app)
        .post('/webhook')
        .send(mockEvent);

      expect(response.status).toBe(200);
      expect(StravaService.getActivity).not.toHaveBeenCalled();
      expect(StravaService.updateActivityTitle).not.toHaveBeenCalled();
    });

    it('should handle missing tokens gracefully', async () => {
      const mockEvent = {
        object_type: 'activity',
        object_id: '987654',
        aspect_type: 'create',
        owner_id: '123456',
        subscription_id: '1',
        event_time: 1234567890,
      };

      // Mock Supabase to return no tokens
      global.mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({ data: null })
      });

      const response = await request(app)
        .post('/webhook')
        .send(mockEvent);

      expect(response.status).toBe(200);
      expect(StravaService.getActivity).not.toHaveBeenCalled();
      expect(StravaService.updateActivityTitle).not.toHaveBeenCalled();
    });

    it('should ignore non-activity events', async () => {
      const mockEvent = {
        object_type: 'athlete',
        object_id: '123456',
        aspect_type: 'update',
        owner_id: '123456',
        subscription_id: '1',
        event_time: 1234567890,
      };

      const response = await request(app)
        .post('/webhook')
        .send(mockEvent);

      expect(response.status).toBe(200);
      expect(global.mockSupabase.from).not.toHaveBeenCalled();
      expect(StravaService.getActivity).not.toHaveBeenCalled();
      expect(StravaService.updateActivityTitle).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const mockEvent = {
        object_type: 'activity',
        object_id: '987654',
        aspect_type: 'create',
        owner_id: '123456',
        subscription_id: '1',
        event_time: 1234567890,
      };

      // Mock Supabase to throw an error
      global.mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockRejectedValueOnce(new Error('Database error'))
      });

      const response = await request(app)
        .post('/webhook')
        .send(mockEvent);

      expect(response.status).toBe(200);
      expect(StravaService.getActivity).not.toHaveBeenCalled();
      expect(StravaService.updateActivityTitle).not.toHaveBeenCalled();
    });
  });
}); 