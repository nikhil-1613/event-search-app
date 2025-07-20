# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY frontend/event-search/package*.json ./
RUN npm install

COPY frontend/event-search/ ./
RUN npm run build

# Optional: Serve using 'serve'
RUN npm install -g serve
CMD ["serve", "-s", "build"]
