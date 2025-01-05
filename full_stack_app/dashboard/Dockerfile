### Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

### Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Add security headers
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "preview"]