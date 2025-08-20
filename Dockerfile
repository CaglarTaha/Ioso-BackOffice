# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the source code
COPY . .

# Build the TypeScript code
RUN bun run build

# Expose the application port
EXPOSE 8080

# Run the app
CMD ["bun", "src/index.ts"]
