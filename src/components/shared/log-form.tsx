"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { analyzeAndSaveLog } from "@/actions/analyze-log";

export function LogForm() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    // Appel de notre Server Action IA + BDD
    const result = await analyzeAndSaveLog(prompt);

    setIsLoading(false);

    if (result.success && result.data) {
      alert(`IA a extrait :\nProjet : ${result.data.projectName}\nCatégorie : ${result.data.category}\nDurée : ${result.data.duration}h`);
      setPrompt(""); // On vide le formulaire
    } else {
      alert(result.error || "Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Ex: Aujourd'hui j'ai travaillé 3h sur l'intégration du paiement Stripe pour le projet Nova, puis 45 minutes en réunion client..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-37.5 resize-none border-slate-200 focus-visible:ring-slate-400"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2"
        disabled={isLoading || !prompt.trim()}
      >
        <Sparkles className="w-4 h-4" />
        {isLoading ? "Analyse IA en cours..." : "Analyser ma journée"}
      </Button>
    </form>
  );
}