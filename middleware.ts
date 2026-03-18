import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Implement auth guard and role-based access control
export function middleware(request: NextRequest) {
  // Placeholder — add JWT verification & role checks here
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/elections/:path*/vote"],
};
