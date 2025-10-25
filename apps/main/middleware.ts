import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * SUBDOMAIN ROUTING CONFIGURATION
 *
 * This middleware handles routing for all yoohoo.guru subdomains.
 * All subdomain pages are located in: apps/main/pages/_apps/{subdomain}/
 *
 * Architecture: Single-app monorepo
 * - apps/main/ is the only Next.js app
 * - Subdomain pages are at pages/_apps/{subdomain}/index.tsx
 * - Middleware rewrites subdomain requests to /_apps/{subdomain}/ paths
 */
const VALID_SUBDOMAINS = new Set([
  // Core services
  "www", "angel", "coach", "heroes", "dashboard",

  // Subject-specific subdomains (24 content hubs)
  "art", "business", "coding", "cooking", "crafts", "data", "design",
  "finance", "fitness", "gardening", "history", "home", "investing",
  "language", "marketing", "math", "music", "photography", "sales",
  "science", "sports", "tech", "wellness", "writing"
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Skip middleware for special paths
  if (url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/favicon") ||
      url.pathname.startsWith("/static") ||
      url.pathname.startsWith("/auth") ||
      url.pathname.includes(".")) { // Skip files with extensions
    return NextResponse.next();
  }

  // Extract subdomain from hostname
  // Examples:
  // - coach.yoohoo.guru -> coach
  // - www.yoohoo.guru -> www
  // - yoohoo.guru -> www (default to www)
  // - localhost:3000 -> www (development)
  let subdomain = "www";

  if (hostname.includes("yoohoo.guru")) {
    const parts = hostname.split(".");
    subdomain = parts.length >= 3 ? parts[0] : "www";
  } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    // Development mode - default to www
    subdomain = "www";
  }

  // Validate subdomain exists in our configuration
  if (!VALID_SUBDOMAINS.has(subdomain)) {
    // Unknown subdomain - redirect to www
    console.warn(`Unknown subdomain: ${subdomain}, redirecting to www`);
    subdomain = "www";
  }

  // Handle www/main subdomain - serve directly from pages/ directory
  if (subdomain === "www") {
    // These pages exist at pages/ root level
    const wwwPaths = ["/", "/login", "/signup", "/dashboard", "/privacy", "/terms", "/about", "/contact"];
    if (wwwPaths.includes(url.pathname) || url.pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }
  }

  // Skip if already rewritten to _apps
  if (url.pathname.startsWith("/_apps")) {
    return NextResponse.next();
  }

  // For all non-www subdomains, rewrite to _apps directory
  // This maps coach.yoohoo.guru/ to pages/_apps/coach/index.tsx
  if (subdomain !== "www") {
    const rewritePath = `/_apps/${subdomain}${url.pathname}`;
    url.pathname = rewritePath;

    // Add debug header in development
    const response = NextResponse.rewrite(url);
    if (process.env.NODE_ENV === "development") {
      response.headers.set("x-middleware-rewrite", rewritePath);
      response.headers.set("x-subdomain", subdomain);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except:
  // - API routes (handled by backend)
  // - Static files (_next/static/*)
  // - Public files (favicon.ico, etc.)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
