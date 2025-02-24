import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublic = createRouteMatcher(["/sign-in"]);

export default convexAuthNextjsMiddleware(async (req) => {
  const isAuthenticated = await isAuthenticatedNextjs();
  console.log("isAuthenticated", isAuthenticated);
  const path = req.nextUrl.pathname;

  // Allow public routes
  if (isPublic(req)) {
    // Redirect authenticated users away from sign-in
    if (path === "/sign-in" && isAuthenticated) {
      return nextjsMiddlewareRedirect(req, "/");
    }
    return;
  }

  // Protect all other routes
  if (!isAuthenticated) {
    console.log("redirecting");
    return nextjsMiddlewareRedirect(req, "/sign-in");
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
