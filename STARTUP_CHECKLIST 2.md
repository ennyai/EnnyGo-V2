# EnnyGo Startup Checklist

## 1. Initial Setup
- [ ] Start ngrok tunnel:
```bash
ngrok http 3001
```
- [ ] Copy the ngrok URL and update `.env`:
  - Update `WEBHOOK_CALLBACK_URL=https://[your-ngrok-url]/api/strava/webhook`
  - Update `VITE_STRAVA_WEBHOOK_URL=https://[your-ngrok-url]/api/strava/webhook`

## 2. Start Development Servers
- [ ] Kill any existing Node processes:
```bash
pkill -f node
```
- [ ] Start both frontend and backend servers:
```bash
yarn dev:all
```
- [ ] Verify servers are running:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:3001/health

## 3. Verify Webhook Connection
- [ ] Initialize Strava webhook:
```bash
node src/server/scripts/initWebhook.js
```
- [ ] Test webhook verification:
```bash
curl -X GET "https://[your-ngrok-url]/api/strava/webhook?hub.verify_token=ennygo_webhook_verify_token_123&hub.challenge=test_challenge&hub.mode=subscribe"
```
- [ ] Expected response: `{"hub.challenge":"test_challenge"}`

## 4. Verify Strava Integration
- [ ] Open http://localhost:3000
- [ ] Sign in to your account
- [ ] Test Strava connection:
  - Click "Connect with Strava"
  - Authorize the application
  - Verify dashboard shows your activities

## Troubleshooting
If any step fails:
1. Check the server logs for errors
2. Verify environment variables are set correctly
3. Try resetting the webhook:
```bash
node src/server/scripts/reset-webhook.js
```
4. Clear database state if needed:
```bash
node src/server/scripts/cleanup.js
``` 