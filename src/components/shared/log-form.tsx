// src/components/shared/log-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react"; // Optionnel : installez lucide-react si nécessaire (npm i lucide-react)

export function LogForm() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    // Simulation d'une attente réseau (on connectera l'IA à l'Étape 6)
    setTimeout(() => {
      alert(`Texte soumis avec succès ! (Simulation)\n\n"${prompt}"`);
      setPrompt("");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Ex: Aujourd'hui j'ai travaillé 3h sur l'intégration du paiement Stripe pour le projet Nova, puis 2h en réunion client..."
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