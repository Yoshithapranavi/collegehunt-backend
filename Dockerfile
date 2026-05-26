FROM node:18-slim

WORKDIR /app

# Copy all files
COPY . .

# Clean previous builds only
RUN rm -rf dist

# Install dependencies
RUN npm install --legacy-peer-deps --no-optional

# Build TypeScript
RUN npm run build

# Verify build succeeded
RUN test -f dist/index.js || (echo "ERROR: dist/index.js not found" && exit 1)
RUN test -f dist/routes/colleges.js || (echo "ERROR: dist/routes/colleges.js not found" && exit 1)

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
USER nodejs

EXPOSE 3000

# Start application directly
CMD ["node", "dist/index.js"]
