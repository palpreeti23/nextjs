// export { auth as middleware } from "@/app/api/auth/[...nextauth]/route";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export { auth as middleware };

export async function redirectMiddlewar(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up")
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/sign-in", "/dashboard/:path*"],
};
