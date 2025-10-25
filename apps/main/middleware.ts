import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Map subdomains to their respective app directories
const SUBDOMAIN_MAP: Record<string, string> = {
  // Core services
  "www": "main",
  "angel": "angel",
  "coach": "coach",
  "heroes": "heroes",
  "dashboard": "dashboard",
  
  // Subject-specific subdomains
  "art": "art",
  "business": "business",
  "coding": "coding",
  "cooking": "cooking",
  "crafts": "crafts",
  "data": "data",
  "design": "design",
  "finance": "finance",
  "fitness": "fitness",
  "gardening": "gardening",
  "history": "history",
  "home": "home",
  "investing": "investing",
  "language": "language",
  "marketing": "marketing",
  "math": "math",
  "music": "music",
  "photography": "photography",
  "sales": "sales",
  "science": "science",
  "sports": "sports",
  "tech": "tech",
  "wellness": "wellness",
  "writing": "writing",
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  
  // Skip middleware for API routes, static files, and auth
  if (url.pathname.startsWith("/api") || 
      url.pathname.startsWith("/_next") || 
      url.pathname.startsWith("/favicon") ||
      url.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }
  
  // Extract subdomain from hostname
  // Examples: 
  // - angel.yoohoo.guru -> angel
  // - www.yoohoo.guru -> www
  // - yoohoo.guru -> www (default)
  const subdomain = hostname.includes("yoohoo.guru") ? hostname.split(".")[0] : "www";
  
  // Handle root domain (yoohoo.guru) as www
  const targetSubdomain = hostname === "yoohoo.guru" || 
                         hostname === "localhost:3000" || 
                         hostname === "localhost:3001" ||
                         subdomain === "www"
    ? "www" 
    : subdomain;
  
  // Get the app directory for this subdomain
  const appDir = SUBDOMAIN_MAP[targetSubdomain];
  
  // If subdomain not found in map, default to main
  const targetApp = appDir || "main";
  
  // For www subdomain and main app, don't rewrite if it's already the root path or login/signup
  // This prevents the redirect loop and ensures proper routing
  if (targetSubdomain === "www" && targetApp === "main") {
    // Allow direct access to login, signup, dashboard, etc. without rewriting
    if (url.pathname === "/" || 
        url.pathname === "/login" || 
        url.pathname === "/signup" ||
        url.pathname === "/dashboard" ||
        url.pathname === "/privacy" ||
        url.pathname === "/terms") {
      return NextResponse.next();
    }
  }
  
  // Only rewrite if the path doesn't already start with /_apps
  if (!url.pathname.startsWith("/_apps")) {
    // Skip rewriting for certain main app paths to prevent conflicts
    if (targetApp === "main" && (
        url.pathname === "/" ||
        url.pathname.startsWith("/login") ||
        url.pathname.startsWith("/signup") ||
        url.pathname.startsWith("/dashboard") ||
        url.pathname.startsWith("/api")
    )) {
      return NextResponse.next();
    }
    
    // Rewrite the URL to the appropriate app directory
    // The rewrite is internal - the user still sees the original URL
    url.pathname = `/_apps/${targetApp}${url.pathname}`;
    return NextResponse.rewrite(url);
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
