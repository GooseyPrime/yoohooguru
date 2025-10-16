// validate-firebase-production.js
const { execSync } = require("child_process");

console.log("🔍 Validating Firebase Production Environment...");

try {
  execSync("firebase --version", { stdio: "inherit" });
  execSync("firebase projects:list", { stdio: "inherit" });
  console.log("✅ Firebase CLI is configured correctly for production.");
} catch (err) {
  console.error("❌ Firebase validation failed. Ensure you're logged in:");
  console.error("   > firebase login");
  console.error("   > firebase use --add");
  process.exit(1);
}
