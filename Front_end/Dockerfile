# Frontend Dockerfile
# Use a Node version compatible with Vite 7 (requires Node >= 20.19 or >= 22.12)
FROM node:20.19

WORKDIR /app

# Copy dependency manifests first for better caching
COPY package*.json ./

# Prefer clean, reproducible installs when lockfile exists
RUN npm ci || npm install

# Copy the rest
COPY . .

# Vite dev server needs to bind to all interfaces in a container
ENV HOST=0.0.0.0
ENV PORT=5173

# Expose Vite port
EXPOSE 5173

# Start Vite dev server; pass --host so it's reachable from host machine
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
