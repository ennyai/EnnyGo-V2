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

# Set runtime environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose the port
EXPOSE $PORT

# Start the server
CMD ["yarn", "start"] 