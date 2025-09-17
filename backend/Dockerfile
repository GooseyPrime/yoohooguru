# First stage – install dependencies
FROM node:20-alpine AS deps
WORKDIR /app/backend
# Copy only package files to install dependencies
COPY backend/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Second stage – build runtime image
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
# Copy the backend source code from the repository
COPY backend/. .

# Railway injects PORT; the app must use process.env.PORT
EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-3001}/health || exit 1

CMD ["npm", "start"]