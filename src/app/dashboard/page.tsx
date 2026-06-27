// src/app/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"; // Import standard de redirection Next.js
import { UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogForm } from "@/components/shared/log-form";
import { LogHistory } from "@/components/shared/log-history";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  // Sécurité : Si l'utilisateur n'est pas connecté, on le redirige vers l'accueil
  if (!userId || !user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 1. Barre de navigation haute */}
      <header className="sticky top-0 z-40 border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-slate-900 tracking-tight">FreelancePulse</span>
          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">SaaS</span>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-slate-600 hidden sm:block">
            Bonjour, <span className="font-medium text-slate-900">{user.firstName || user.emailAddresses[0].emailAddress}</span>
          </p>
          <UserButton />
        </div>
      </header>

      {/* 2. Contenu Principal */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne de gauche : Formulaire de prompt IA (Prend 1 colonne sur 3) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Racontez votre journée</CardTitle>
              <CardDescription>
                Écrivez en langage naturel ce que vous avez fait aujourd&apos;hui. L&apos;IA s&apos;occupe de structurer vos heures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* On appelle ici notre composant de formulaire qu'on va créer juste après */}
              <LogForm />
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite : Historique et statistiques (Prend 2 colonnes sur 3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Activités récentes</CardTitle>
              <CardDescription>
                Retrouvez vos temps de travail analysés et catégorisés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* On appelle ici le composant d'historique qu'on va créer juste après */}
              <LogHistory />
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}