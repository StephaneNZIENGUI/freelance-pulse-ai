// Définition du type d'un Log pour TypeScript
interface Log {
  id: string;
  projectName: string;
  category: string;
  duration: number;
  rawText: string;
  createdAt: Date;
}

interface LogHistoryProps {
  logs: Log[];
}

export function LogHistory({ logs }: LogHistoryProps) {
  // Fonction utilitaire pour attribuer une couleur au badge selon la catégorie
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Dev":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Design":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Réunion":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Marketing":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

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
    <div className="divide-y divide-slate-100">
      {logs.map((log) => (
        <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-900 text-sm">{log.projectName}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryStyle(log.category)}`}>
                {log.category}
              </span>
            </div>
            {/* Texte original soumis par le freelance en italique discret */}
            <p className="text-xs text-slate-500 italic line-clamp-2">
              &ldquo;{log.rawText}&rdquo;
            </p>
          </div>
          
          <div className="flex items-center sm:text-right gap-4 sm:gap-0 sm:flex-col justify-between shrink-0">
            <span className="text-sm font-bold text-slate-900 bg-slate-100 sm:bg-transparent px-2 py-1 sm:p-0 rounded">
              {log.duration} h
            </span>
            <span className="text-[11px] text-slate-400">
              {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}