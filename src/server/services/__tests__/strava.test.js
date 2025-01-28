import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StravaService } from '../strava';

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

      global.mockAxios.get.mockResolvedValueOnce({ data: mockActivity });

      const result = await StravaService.getActivity(mockActivityId, mockAccessToken);

      expect(global.mockAxios.get).toHaveBeenCalledWith(
        `https://www.strava.com/api/v3/activities/${mockActivityId}`,
        { headers: { Authorization: `Bearer ${mockAccessToken}` } }
      );
      expect(result).toEqual(mockActivity);
    });

    it('should handle errors when fetching activity', async () => {
      const errorMessage = 'Authorization Error';
      global.mockAxios.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(
        StravaService.getActivity(mockActivityId, mockAccessToken)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('updateActivityTitle', () => {
    it('should update activity title successfully', async () => {
      const newTitle = 'Updated Activity Title';
      const mockUpdatedActivity = {
        id: mockActivityId,
        name: newTitle,
      };

      global.mockAxios.put.mockResolvedValueOnce({ data: mockUpdatedActivity });

      const result = await StravaService.updateActivityTitle(
        mockActivityId,
        mockAccessToken,
        newTitle
      );

      expect(global.mockAxios.put).toHaveBeenCalledWith(
        `https://www.strava.com/api/v3/activities/${mockActivityId}`,
        { name: newTitle },
        { headers: { Authorization: `Bearer ${mockAccessToken}` } }
      );
      expect(result).toBe(true);
    });

    it('should handle errors when updating activity title', async () => {
      const errorMessage = 'Authorization Error';
      global.mockAxios.put.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(
        StravaService.updateActivityTitle(mockActivityId, mockAccessToken, 'New Title')
      ).rejects.toThrow(errorMessage);
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
      expect(title).toContain('5.0km');
      expect(title).toContain('run');
    });

    it('should generate creative title for a ride activity', () => {
      const mockActivity = {
        type: 'Ride',
        distance: 20000,
        start_date: '2024-03-20T10:00:00Z'
      };

      const title = StravaService.generateCreativeTitle(mockActivity);
      expect(title).toContain('20.0km');
      expect(title).toContain('ride');
    });
  });
}); 