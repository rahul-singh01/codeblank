# Use multi-stage build for security and efficiency
# Stage 1: Builder for development and dependencies
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies (including dev dependencies for development)
RUN npm ci --include=dev

# Copy all source files
COPY . .

# Stage 2: Production image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built assets from builder
COPY --from=builder /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user and set permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose application port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start command
CMD ["npm", "start"]