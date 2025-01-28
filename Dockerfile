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

# Build arguments for Vite
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Build the frontend with environment variables
RUN VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
    VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
    yarn build

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

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Expose the port
EXPOSE $PORT

# Start the server
CMD ["yarn", "start"] 