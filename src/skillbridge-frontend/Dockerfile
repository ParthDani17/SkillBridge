# --- Stage 1: Build React static assets ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 
#  for dependency injection, use npm ci instead of npm install for reproducible builds,
#  npm ci because we want Docker build to install exactly the dependency versions defined in our lock file.

COPY . .

# Optional build-time argument for API base URL if needed (defaults to relative /api/v1)
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_SOCKET_URL=/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# --- Stage 2: Serve using lightweight Nginx --- so we no longer need Node.js
FROM nginx:alpine

# Remove default nginx static page
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled production bundle from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
