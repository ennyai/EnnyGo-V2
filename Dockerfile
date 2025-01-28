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

# Expose the port the app runs on
EXPOSE 3001

# Start the server
CMD ["yarn", "start"] 