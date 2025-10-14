#!/usr/bin/env node
/**
 * Generate a secure NEXTAUTH_SECRET for use in environment configuration
 * 
 * Usage:
 *   node scripts/generate-nextauth-secret.js
 * 
 * This generates a 32-byte random string encoded in base64, which is suitable
 * for use as the NEXTAUTH_SECRET environment variable.
 */

const crypto = require('crypto');

// Generate 32 random bytes and encode as base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated NEXTAUTH_SECRET:\n');
console.log(secret);
console.log('\n📋 Add this to your .env file or deployment platform:\n');
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('\n⚠️  Keep this secret secure! Never commit it to version control.\n');
