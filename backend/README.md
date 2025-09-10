# YooHoo.guru Backend API

Backend API for the YooHoo.guru skill-sharing platform.

## Railway Deployment

This backend is configured for deployment on Railway. The deployment uses the following configuration files:

- `nixpacks.toml` - Nixpacks build configuration
- `railway.json` - Railway deployment settings
- `.env` - Environment variables (copy from `.env.example` and configure)

### Build Process

Railway will automatically:
1. Install dependencies: `npm install`
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Health Check

The application provides a health check endpoint at `/health` which Railway uses to monitor deployment status.

### Environment Variables

Make sure to configure the following environment variables in Railway:
- Firebase configuration (FIREBASE_*)
- Stripe configuration (STRIPE_*)
- JWT secret (JWT_SECRET)
- Other secrets as needed

See `.env.example` for a complete list of environment variables.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```