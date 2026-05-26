FROM node:18-slim

WORKDIR /app

# Copy all source files first
COPY . .

# Clean previous builds
RUN rm -rf dist node_modules

# Install dependencies
RUN npm install --legacy-peer-deps --no-optional

# Build TypeScript
RUN npm run build

# Verify dist was created
RUN ls -la dist/routes/

# Keep only production dependencies
RUN npm prune --production --legacy-peer-deps

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
USER nodejs

EXPOSE 3000

# Start application directly
CMD ["node", "dist/index.js"]
