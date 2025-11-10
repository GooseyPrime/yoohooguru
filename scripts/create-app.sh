#!/bin/bash

# Script to create Next.js app structure for yoohoo.guru monorepo

APP_NAME=$1
SUBDOMAIN=$2
DESCRIPTION=$3

if [ -z "$APP_NAME" ] || [ -z "$SUBDOMAIN" ]; then
  echo "Usage: ./create-app.sh <app-name> <subdomain> <description>"
  exit 1
fi

APP_DIR="apps/$APP_NAME"

# Create app directory structure
mkdir -p "$APP_DIR"/{pages,public,styles}

# Create package.json
cat > "$APP_DIR/package.json" << EOF
{
  "name": "@yoohooguru/$APP_NAME",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@yoohooguru/shared": "*",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Create next.config.js
cat > "$APP_DIR/next.config.js" << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@yoohooguru/shared'],
  env: {
    NEXT_PUBLIC_SUBDOMAIN: '$SUBDOMAIN',
  },
}

module.exports = nextConfig
EOF

# Create tsconfig.json
cat > "$APP_DIR/tsconfig.json" << EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@yoohooguru/shared": ["../../packages/shared/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

# Create pages/_app.tsx
cat > "$APP_DIR/pages/_app.tsx" << EOF
import type { AppProps } from 'next/app'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
EOF

# Create pages/index.tsx
cat > "$APP_DIR/pages/index.tsx" << EOF
import { Header } from '@yoohooguru/shared'

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>${DESCRIPTION}</h1>
        <p>Welcome to $SUBDOMAIN.yoohoo.guru</p>
      </main>
    </div>
  )
}
EOF

# Create styles/globals.css
cat > "$APP_DIR/styles/globals.css" << EOF
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

a {
  color: inherit;
  text-decoration: none;
}
EOF

# Create .gitignore
cat > "$APP_DIR/.gitignore" << EOF
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

echo "✅ Created app: $APP_DIR"
