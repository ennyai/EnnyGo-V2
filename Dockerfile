# Use Node.js LTS version
FROM node:20-slim as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_STRAVA_CLIENT_ID
ARG VITE_STRAVA_CLIENT_SECRET
ARG VITE_STRAVA_REDIRECT_URI
ARG VITE_STRAVA_AUTH_URL
ARG VITE_STRAVA_TOKEN_URL
ARG VITE_API_URL
ARG VITE_STRAVA_WEBHOOK_URL

# Set environment variables for the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_STRAVA_CLIENT_ID=$VITE_STRAVA_CLIENT_ID
ENV VITE_STRAVA_CLIENT_SECRET=$VITE_STRAVA_CLIENT_SECRET
ENV VITE_STRAVA_REDIRECT_URI=$VITE_STRAVA_REDIRECT_URI
ENV VITE_STRAVA_AUTH_URL=$VITE_STRAVA_AUTH_URL
ENV VITE_STRAVA_TOKEN_URL=$VITE_STRAVA_TOKEN_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRAVA_WEBHOOK_URL=$VITE_STRAVA_WEBHOOK_URL

# Build the frontend
RUN yarn build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/utils ./src/utils

# Set runtime environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose the port
EXPOSE $PORT

# Start the server
CMD ["yarn", "start"] 