import { NextResponse } from "next/server";

/**
 * Health check endpoint
 * Used by Docker, monitoring services, and load balancers
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "0.1.0",
    },
    { status: 200 }
  );
}
