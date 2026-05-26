FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm install --legacy-peer-deps --no-optional

# Copy source code
COPY src ./src/
COPY tsconfig*.json ./

# Build TypeScript
RUN npm run build

# Remove devDependencies AFTER copying built dist folder
RUN npm prune --production --legacy-peer-deps

# Copy startup script
COPY start.sh ./
RUN chmod +x ./start.sh

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user (Debian-based)
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/index.js"]
