import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StravaService } from '../strava';
import axios from 'axios';

vi.mock('axios');

describe('StravaService', () => {
  const mockActivityId = '123456';
  const mockAccessToken = 'test-access-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActivity', () => {
    it('should fetch activity details successfully', async () => {
      const mockActivity = {
        id: mockActivityId,
        name: 'Test Activity',
        type: 'Run',
        distance: 5000,
        start_date: '2024-03-20T10:00:00Z'
      };

      axios.get.mockResolvedValueOnce({ data: mockActivity });

      const result = await StravaService.getActivity(mockActivityId, mockAccessToken);

      expect(axios.get).toHaveBeenCalledWith(
        `https://www.strava.com/api/v3/activities/${mockActivityId}`,
        { headers: { Authorization: `Bearer ${mockAccessToken}` } }
      );
      expect(result).toEqual(mockActivity);
    });

    it('should handle errors when fetching activity', async () => {
      axios.get.mockRejectedValueOnce({
        response: { data: { message: 'Failed to fetch activity from Strava' } },
      });

      await expect(
        StravaService.getActivity(mockActivityId, mockAccessToken)
      ).rejects.toThrow('Failed to fetch activity from Strava');
    });
  });

  describe('updateActivityTitle', () => {
    it('should update activity title successfully', async () => {
      const newTitle = 'Updated Activity Title';
      const mockUpdatedActivity = {
        id: mockActivityId,
        name: newTitle,
      };

      axios.put.mockResolvedValueOnce({ data: mockUpdatedActivity });

      const result = await StravaService.updateActivityTitle(mockActivityId, newTitle, mockAccessToken);

      expect(axios.put).toHaveBeenCalledWith(
        `https://www.strava.com/api/v3/activities/${mockActivityId}`,
        { name: newTitle },
        { headers: { Authorization: `Bearer ${mockAccessToken}` } }
      );
      expect(result).toEqual(mockUpdatedActivity);
    });

    it('should handle errors when updating activity title', async () => {
      axios.put.mockRejectedValueOnce({
        response: { data: { message: 'Failed to update activity title on Strava' } },
      });

      await expect(
        StravaService.updateActivityTitle(mockActivityId, 'New Title', mockAccessToken)
      ).rejects.toThrow('Failed to update activity title on Strava');
    });
  });

  describe('generateCreativeTitle', () => {
    it('should generate creative title for a run activity', () => {
      const mockActivity = {
        type: 'Run',
        distance: 5000,
        start_date: '2024-03-20T10:00:00Z'
      };

      const title = StravaService.generateCreativeTitle(mockActivity);
      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
    });

    it('should generate creative title for a ride activity', () => {
      const mockActivity = {
        type: 'Ride',
        distance: 20000,
        start_date: '2024-03-20T10:00:00Z'
      };

      const title = StravaService.generateCreativeTitle(mockActivity);
      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
    });
  });
}); 