import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Définir les routes qui sont publiques (accessibles sans connexion)
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks/clerk(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // Protège toutes les autres routes
  }
});

export const config = {
  matcher: [
    // Ignore les fichiers internes de Next.js et les fichiers statiques
    '/((?!_next|[^?]*\\.[^?]*$$).*)',
    // Applique Clerk sur les routes d'API
    '/(api|trpc)(.*)',
  ],
};