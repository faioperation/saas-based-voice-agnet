# ═══════════════════════════════════════════════════════════════
# STAGE 1 — Build the React app
# ═══════════════════════════════════════════════════════════════
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# ─────────────────────────────────────────────────────────────
# VITE_API_BASE_URL is a BUILD-TIME argument.
# Vite bakes this value into the JS bundle during `npm run build`.
# It must point to where the USER'S BROWSER can reach the backend.
#
# This value is set in docker-compose.yml under build.args.
# To switch between local and production, edit docker-compose.yml.
# ─────────────────────────────────────────────────────────────
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ═══════════════════════════════════════════════════════════════
# STAGE 2 — Serve the built files with Nginx
# ═══════════════════════════════════════════════════════════════
FROM nginx:alpine

# Copy built files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# ─────────────────────────────────────────────────────────────
# Nginx config for Single Page Application (SPA) routing.
# Without this, refreshing any page other than "/" returns 404
# because Nginx looks for a real file at that path.
# try_files falls back to index.html for all routes so
# React Router can handle navigation client-side.
# ─────────────────────────────────────────────────────────────
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
