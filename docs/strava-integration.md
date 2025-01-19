# Strava API Integration

## Important Links
- [Strava API Getting Started Guide](https://developers.strava.com/docs/getting-started/)
- [Authentication Documentation](https://developers.strava.com/docs/authentication)
- [API Reference](https://developers.strava.com/docs/reference)
- [Webhooks Documentation](https://developers.strava.com/docs/webhooks)

## Integration Steps
1. Create Strava API Application
   - Register at https://www.strava.com/settings/api
   - Set Authorization Callback Domain
   - Store Client ID and Client Secret securely

2. OAuth 2.0 Flow
   ```
   1. User clicks "Connect with Strava"
   2. Redirect to Strava authorization page
   3. User authorizes app
   4. Strava redirects back with auth code
   5. Exchange auth code for tokens
   6. Store refresh token & access token
   ```

3. Required Scopes
   - read: Read public segments, routes, and user data
   - read_all: Read private routes, segments, and user data
   - activity:read: Read activities
   - activity:read_all: Read private activities

4. Rate Limits
   - 200 requests every 15 minutes
   - 2,000 requests per day
   - Use webhooks to avoid polling

## Implementation Notes
- Keep Client Secret confidential
- Access tokens expire every 6 hours
- Use refresh tokens to get new access tokens
- Implement webhook subscription for activity updates
- Handle deauthorization webhooks

## Data to Sync
- [ ] Athlete Profile
- [ ] Activities
- [ ] Stats
- [ ] Routes
- [ ] Achievements

## Security Considerations
- Never expose tokens in client-side code
- Store tokens securely in backend
- Implement proper error handling
- Handle token refresh automatically
- Monitor rate limits

## Testing
- Use localhost for development
- Test with sample data
- Verify OAuth flow
- Check error scenarios
- Test webhook handling 