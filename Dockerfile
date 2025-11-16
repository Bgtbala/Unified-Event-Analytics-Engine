# ------------------------------
# 1. Base Image
# ------------------------------
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files first (Better cache)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install

# Copy remaining source files
COPY . .

# ------------------------------
# 2. Build & Run
# ------------------------------
EXPOSE 8000

CMD ["node", "server.js"]
