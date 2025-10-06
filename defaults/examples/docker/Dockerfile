# Use the official Node.js image from the Docker Hub
FROM node:22-alpine AS base
# Create and change to the app directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install app dependencies
RUN npm install

FROM base AS development
ENV NODE_ENV=development
# Build the application
RUN npm ci
# Copy the rest of the application code
COPY . .
# Command to run the application
CMD ["npm", "run", "dev"]

FROM base AS production
ENV NODE_ENV=production
# Build the application
RUN npm ci --omit=dev
# Copy the rest of the application code
COPY . .
# Build the application
RUN npm run build
# Command to run the application
CMD ["npm", "run", "start"]

