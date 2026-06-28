import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="absolute top-4 right-4">
        {/* Affiche le bouton de profil Clerk si connecté, sinon rien */}
        <UserButton />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          FreelancePulse AI
        </h1>
        <p className="text-slate-600 max-w-md mx-auto">
          Suivez votre productivité et générez vos rapports d&apos;activité grâce à
          la puissance de l&apos;IA.
        </p>
        <div className="pt-4">
          {userId ? (
            <Link href="/dashboard">
              <Button size="lg">Accéder au Tableau de Bord</Button>
            </Link>
          ) : (
            <Link href="/sign-up">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
