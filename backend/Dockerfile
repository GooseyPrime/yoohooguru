FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files - note: don't copy root package.json to avoid workspace issues
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies directly
RUN cd backend && npm ci --only=production && npm cache clean --force

# Install frontend dependencies (including dev dependencies for build)
RUN cd frontend && npm ci && npm cache clean --force

# Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Start the application from backend directory
WORKDIR /app/backend
CMD ["node", "src/index.js"]