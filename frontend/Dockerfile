# frontend/Dockerfile

# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY frontend/event-search/package*.json ./
RUN npm install

# Copy the full frontend code and build
COPY frontend/event-search/ ./
RUN npm run build

# Install a lightweight static file server to serve the build
RUN npm install -g serve

# Expose frontend port
EXPOSE 3000

# Serve the build folder
CMD ["serve", "-s", "build"]
