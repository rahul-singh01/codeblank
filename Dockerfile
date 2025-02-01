# Stage 1: Build Stage
FROM node:16 AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Production Stage
FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the built application code from the builder stage
COPY --from=builder /app .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]