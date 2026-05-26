FROM node:18-alpine

WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

# Copy everything
COPY . .

# Clean up unnecessary files
RUN rm -rf .git .github node_modules dist || true

# Install ALL dependencies (including devDependencies for build tools)
RUN npm install --legacy-peer-deps --no-optional

# Build TypeScript (skip prisma generate - client already in node_modules)
RUN npm run build

# Clean install - remove devDependencies after build
RUN rm -rf node_modules && npm install --only=production --legacy-peer-deps --no-optional

# Copy startup script
COPY start.sh ./
RUN chmod +x ./start.sh

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["sh", "./start.sh"]
