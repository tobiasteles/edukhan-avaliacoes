import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/marketing(.*)', '/api/webhooks/stripe(.*)', '/forum(.*)','/admin(.*)',])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

   const { userId } = await auth();
    const isAdmin = userId; // ou busca de roles, se tiver
    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return Response.redirect(new URL('/', req.url))
    }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}