// src/components/shared/log-history.tsx
export function LogHistory() {
  // Pour l'instant, on simule une liste vide. On connectera la BDD plus tard.
  const logs = [];

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-semibold mb-3">
          📊
        </div>
        <h3 className="text-sm font-medium text-slate-900">Aucune activité enregistrée</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Vos journées analysées par l&apos;intelligence artificielle s&apos;afficheront ici de manière structurée.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Liste des activités à venir */}
    </div>
  );
}