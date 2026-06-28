// src/app/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogForm } from "../../components/shared/log-form";
import { LogHistory } from "../../components/shared/log-history";
import { db } from "@/lib/db"; // On importe notre instance de base de données

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/");
  }

  // 1. Récupérer l'utilisateur local pour avoir son ID interne
  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
  });

  // 2. Récupérer tous les logs de cet utilisateur, du plus récent au plus ancien
  const logs = dbUser
    ? await db.log.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-40 border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-slate-900 tracking-tight">FreelancePulse</span>
          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">SaaS</span>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-slate-600 hidden sm:block">
            Bonjour, <span className="font-medium text-slate-900">{user.firstName || user.emailAddresses[0]?.emailAddress}</span>
          </p>
          <UserButton  />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Racontez votre journée</CardTitle>
              <CardDescription>
                Écrivez en langage naturel ce que vous avez fait aujourd&apos;hui. L&apos;IA s&apos;occupe de structurer vos heures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogForm />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Activités récentes</CardTitle>
              <CardDescription>
                Retrouvez vos temps de travail analysés et catégorisés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* ✅ On passe désormais les vrais logs récupérés au composant */}
              <LogHistory logs={logs} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}