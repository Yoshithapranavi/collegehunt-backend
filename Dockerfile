FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy everything
COPY . .

# Clean up unnecessary files
RUN rm -rf .git .github node_modules dist || true

# Install dependencies
RUN npm install --legacy-peer-deps --no-optional

# Generate Prisma client with specific version
RUN npx prisma@5.7.1 generate

# Build TypeScript
RUN npm run build

# Remove dev dependencies  
RUN rm -rf node_modules && npm install --only=production --legacy-peer-deps --no-optional

# Copy startup script
COPY start.sh ./
RUN chmod +x ./start.sh

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
