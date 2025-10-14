import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route"; 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const host = request.headers.get('host');
    
    return NextResponse.json({
      host: host,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
      loggedIn: !!session,
      user: session?.user ? { 
        email: session.user.email, 
        id: (session.user as any).id,
        membershipTier: (session.user as any).membershipTier,
      } : null,
      message: session ? "NextAuth session active and persistent." : "No active NextAuth session found.",
      timestamp: new Date().toISOString(),
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      }
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      error: 'Health check failed',
      message: error?.message || 'Unknown error',
      loggedIn: false,
    }, {
      status: 500
    });
  }
}
