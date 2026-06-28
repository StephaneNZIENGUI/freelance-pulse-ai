// // Définition du type d'un Log pour TypeScript
// interface Log {
//   id: string;
//   projectName: string;
//   category: string;
//   duration: number;
//   rawText: string;
//   createdAt: Date;
// }

// interface LogHistoryProps {
//   logs: Log[];
// }

// export function LogHistory({ logs }: LogHistoryProps) {
//   // Fonction utilitaire pour attribuer une couleur au badge selon la catégorie
//   const getCategoryStyle = (category: string) => {
//     switch (category) {
//       case "Dev":
//         return "bg-blue-50 text-blue-700 border-blue-200";
//       case "Design":
//         return "bg-purple-50 text-purple-700 border-purple-200";
//       case "Réunion":
//         return "bg-amber-50 text-amber-700 border-amber-200";
//       case "Marketing":
//         return "bg-emerald-50 text-emerald-700 border-emerald-200";
//       default:
//         return "bg-slate-50 text-slate-700 border-slate-200";
//     }
//   };

//   if (logs.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50">
//         <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-semibold mb-3">
//           📊
//         </div>
//         <h3 className="text-sm font-medium text-slate-900">Aucune activité enregistrée</h3>
//         <p className="text-xs text-slate-500 max-w-xs mt-1">
//           Vos journées analysées par l&apos;intelligence artificielle s&apos;afficheront ici de manière structurée.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="divide-y divide-slate-100">
//       {logs.map((log) => (
//         <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="space-y-1 flex-1">
//             <div className="flex items-center gap-2 flex-wrap">
//               <h4 className="font-semibold text-slate-900 text-sm">{log.projectName}</h4>
//               <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryStyle(log.category)}`}>
//                 {log.category}
//               </span>
//             </div>
//             {/* Texte original soumis par le freelance en italique discret */}
//             <p className="text-xs text-slate-500 italic line-clamp-2">
//               &ldquo;{log.rawText}&rdquo;
//             </p>
//           </div>
          
//           <div className="flex items-center sm:text-right gap-4 sm:gap-0 sm:flex-col justify-between shrink-0">
//             <span className="text-sm font-bold text-slate-900 bg-slate-100 sm:bg-transparent px-2 py-1 sm:p-0 rounded">
//               {log.duration} h
//             </span>
//             <span className="text-[11px] text-slate-400">
//               {new Date(log.createdAt).toLocaleDateString("fr-FR", {
//                 day: "numeric",
//                 month: "short",
//               })}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// src/components/shared/log-history.tsx
"use client";

import { useState, useTransition } from "react";
import { deleteLog, updateLog } from "@/actions/log-actions";

type Log = {
  id: string;
  createdAt: Date;
  userId: string;
  rawText: string;
  projectName: string;
  category: string;
  duration: number;
};

type LogHistoryProps = {
  logs: Log[];
};

const CATEGORIES = ["Dev", "Design", "Réunion", "Marketing", "Autre"];

const categoryColors: Record<string, string> = {
  Dev: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  "Réunion": "bg-amber-100 text-amber-700",
  Marketing: "bg-pink-100 text-pink-700",
  Autre: "bg-slate-100 text-slate-700",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function LogHistory({ logs }: LogHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Champs du formulaire d'édition inline
  const [draft, setDraft] = useState<{
    projectName: string;
    category: string;
    duration: number;
    rawText: string;
  } | null>(null);

  function startEditing(log: Log) {
    setEditingId(log.id);
    setConfirmingDeleteId(null);
    setErrorMessage(null);
    setDraft({
      projectName: log.projectName,
      category: log.category,
      duration: log.duration,
      rawText: log.rawText,
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setDraft(null);
  }

  function saveEditing(logId: string) {
    if (!draft) return;
    setErrorMessage(null);

    startTransition(async () => {
      const result = await updateLog(logId, draft);
      if (result.success) {
        setEditingId(null);
        setDraft(null);
      } else {
        setErrorMessage(result.error ?? "Une erreur est survenue.");
      }
    });
  }

  function handleDelete(logId: string) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await deleteLog(logId);
      if (!result.success) {
        setErrorMessage(result.error ?? "Une erreur est survenue.");
      }
      setConfirmingDeleteId(null);
    });
  }

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
    <div className="space-y-3">
      {errorMessage && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMessage}
        </div>
      )}

      {logs.map((log) => {
        const isEditing = editingId === log.id;
        const isConfirmingDelete = confirmingDeleteId === log.id;

        if (isEditing && draft) {
          return (
            <div
              key={log.id}
              className="p-4 rounded-lg border border-slate-300 bg-slate-50/80 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Projet
                  </label>
                  <input
                    type="text"
                    value={draft.projectName}
                    onChange={(e) =>
                      setDraft({ ...draft, projectName: e.target.value })
                    }
                    className="w-full text-sm rounded-md border border-slate-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Catégorie
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.target.value })
                    }
                    className="w-full text-sm rounded-md border border-slate-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Description
                </label>
                <textarea
                  value={draft.rawText}
                  onChange={(e) => setDraft({ ...draft, rawText: e.target.value })}
                  rows={2}
                  className="w-full text-sm rounded-md border border-slate-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Durée (heures)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={draft.duration}
                  onChange={(e) =>
                    setDraft({ ...draft, duration: parseFloat(e.target.value) || 0 })
                  }
                  className="w-28 text-sm rounded-md border border-slate-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => saveEditing(log.id)}
                  disabled={isPending}
                  className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={isPending}
                  className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          );
        }

        return (
          <div
            key={log.id}
            className="flex items-start justify-between gap-4 p-4 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-900 text-sm">
                  {log.projectName}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    categoryColors[log.category] ?? categoryColors.Autre
                  }`}
                >
                  {log.category}
                </span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{log.rawText}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(log.createdAt)}</p>

              {isConfirmingDelete && (
                <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  <span className="text-xs text-red-700">
                    Supprimer définitivement cette activité ?
                  </span>
                  <button
                    onClick={() => handleDelete(log.id)}
                    disabled={isPending}
                    className="text-xs px-2 py-1 rounded bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isPending ? "Suppression..." : "Confirmer"}
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(null)}
                    disabled={isPending}
                    className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-sm font-semibold text-slate-900">
                {log.duration}h
              </span>
              {!isConfirmingDelete && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(log)}
                    title="Modifier"
                    className="text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded px-2 py-1 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(log.id)}
                    title="Supprimer"
                    className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}