# Backend Dockerfile
FROM node:18

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package*.json ./

RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose backend port
EXPOSE 5001

# Ensure node listens on all interfaces if code relies on HOST
ENV HOST=0.0.0.0

# Start the server
CMD ["npm", "run", "start"]
