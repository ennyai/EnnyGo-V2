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

# Build the frontend
RUN yarn build

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose the port the app runs on
EXPOSE $PORT

# Start the server
CMD ["yarn", "start"] 