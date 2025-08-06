# syntax=docker/dockerfile:1

# Dockerfile for Bun.js TypeORM Backend
# This file creates a production-ready container with Bun.js runtime
# for optimal performance and fast startup times.

ARG BUN_VERSION=1.1.38

################################################################################
# Use Bun base image for all stages.
FROM oven/bun:${BUN_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install additional system dependencies if needed
RUN apk add --no-cache \
    ca-certificates \
    tzdata

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy package.json and bun.lockb for dependency installation
COPY package.json bun.lockb ./

# Install dependencies using Bun (much faster than npm)
RUN bun install --frozen-lockfile --production

################################################################################
# Create a stage for building the application.
FROM base as build

# Copy package files
COPY package.json bun.lockb ./

# Install all dependencies (including dev dependencies for building)
RUN bun install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Build the application (TypeScript compilation)
RUN bun run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
FROM base as final

# Use production environment by default.
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S bunuser && \
    adduser -S bunuser -u 1001

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Copy the production dependencies from the deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the built application from the build stage
COPY --from=build /usr/src/app/build ./build

# Copy source files (for direct TypeScript execution option)
COPY --from=build /usr/src/app/src ./src

# Copy configuration files
COPY --from=build /usr/src/app/tsconfig.json ./
COPY --from=build /usr/src/app/bunfig.toml ./

# Change ownership to bunuser
RUN chown -R bunuser:bunuser /usr/src/app

# Switch to non-root user
USER bunuser

# Expose the port that the application listens on.
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun --version || exit 1

# Run the application using Bun (can run TypeScript directly)
CMD ["bun", "start"]
