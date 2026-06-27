import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          FreelancePulse AI
        </h1>
        <p className="text-slate-600 max-w-md mx-auto">
          Suivez votre productivité et générez vos rapports d&apos;activité grâce à la puissance de l&apos;IA.
        </p>
        <div className="pt-4">
          <Button size="lg">Commencer gratuitement</Button>
        </div>
      </div>
    </main>
  );
}