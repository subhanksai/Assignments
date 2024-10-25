# Use an official Node.js runtime as a parent image
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for frontend and backend
COPY client/package.json ./client/
COPY client/package-lock.json ./client/
COPY server/package.json ./server/
COPY server/package-lock.json ./server/


# Install dependencies for both the frontend and backend
RUN npm install --prefix client
RUN npm install --prefix server

# Copy the rest of the frontend and backend files
COPY client ./client
COPY server ./server

# Build the frontend (if applicable)
RUN npm run build --prefix client

# Start command for your application (adjust as needed)
CMD ["node", "server/index.js"]
