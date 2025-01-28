# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Set production environment and port
ENV NODE_ENV=production
ENV PORT=3001

# Build the frontend with environment variables available
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the frontend
RUN yarn build

# Expose the port the app runs on
EXPOSE $PORT

# Start the server
CMD ["yarn", "start"] 