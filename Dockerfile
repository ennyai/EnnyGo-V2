# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Set build-time arguments for Vite environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    NODE_ENV=production \
    PORT=3001

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Print environment variables for debugging (will be removed in production)
RUN echo "VITE_SUPABASE_URL: $VITE_SUPABASE_URL" && \
    echo "Building with environment variables..."

# Build the frontend
RUN VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    yarn build

# Expose the port the app runs on
EXPOSE $PORT

# Start the server
CMD ["yarn", "start"] 