FROM node:22-slim

# ─────────────────────────────────────────────────────────────
# Install Chromium system libraries required by Puppeteer.
# Puppeteer is used in the project for PDF generation.
# We skip Puppeteer's own Chromium download and use the system one.
# ─────────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to skip downloading Chromium and use the system version
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# ─────────────────────────────────────────────────────────────
# Copy package files first for better Docker layer caching.
# npm ci installs exact versions from package-lock.json.
# ─────────────────────────────────────────────────────────────
COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────
# Copy the Prisma schema and run prisma generate.
# This must happen before copying the rest of the app so that
# @prisma/client is properly generated into node_modules.
# ─────────────────────────────────────────────────────────────
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

EXPOSE 8000

# ─────────────────────────────────────────────────────────────
# Default startup command (only starts the server).
# In docker-compose, this is overridden to also run migrations
# and seed BEFORE starting the server.
# ─────────────────────────────────────────────────────────────
CMD ["node", "src/server.js"]
