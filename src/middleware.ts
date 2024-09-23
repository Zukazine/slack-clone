import { 
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const isPublicPage = createRouteMatcher(["/auth"])

export default convexAuthNextjsMiddleware((request) => {
  if (!isPublicPage(request) && !isAuthenticatedNextjs()){
    return nextjsMiddlewareRedirect(request, "/auth")
    // return NextResponse.redirect(new URL("/auth", request.url))
  };

  if (isPublicPage(request) && isAuthenticatedNextjs()){
    return nextjsMiddlewareRedirect(request, "/")
    // return NextResponse.redirect(new URL("/", request.url))
  };

  return
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export function headers() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}