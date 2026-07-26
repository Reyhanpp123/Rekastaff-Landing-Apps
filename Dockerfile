# ======================
# Builder
# ======================
FROM node:18-alpine AS builder

WORKDIR /app

# WAJIB explicit
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
COPY .env.production .env
RUN npm run build

# ======================
# Runner (LEAN)
# ======================
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3001
CMD ["node", "server.js"]
