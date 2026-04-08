###############################################################################
# Frontend Dockerfile — Next.js 15 + Node.js 22
###############################################################################

# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Base image with Node.js 22
# ──────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Development environment with HMR
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS development

WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

# Install all dependencies (including dev)
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development
ENV PORT=3000

# Start development server
CMD ["npm", "run", "dev"]

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3: Builder (production)
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 4: Production runner (standalone)
# ──────────────────────────────────────────────────────────────────────────────
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

CMD ["node", "server.js"]
