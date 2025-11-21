# Stage 1: Dependency installation
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Run the application
FROM node:20-alpine AS runner
WORKDIR /app

# Copy standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
# Copy public and static directories
COPY --from=builder /app/public ./public
# Optionally install sharp for performant image optimization (if using next/image)
# RUN npm install sharp

CMD ["node", "server.js"]
