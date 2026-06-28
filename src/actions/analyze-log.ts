"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function analyzeAndSaveLog(rawText: string) {
  try {
    // 1. Vérifier si l'utilisateur est bien connecté
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Non autorisé");

    // 2. Récupérer l'utilisateur dans notre BDD Neon, ou le créer s'il n'existe pas encore
    let user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new Error(
          "Impossible de récupérer l'email de l'utilisateur Clerk",
        );
      }

      user = await db.user.create({
        data: {
          clerkId,
          email,
          name: clerkUser?.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
            : null,
        },
      });
    }

    // 3. Demander à OpenAI de structurer le texte en JSON grâce à Vercel AI SDK
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"), // Modèle rapide, intelligent et très économique
      schema: z.object({
        projectName: z
          .string()
          .describe(
            "Le nom du projet ou du client. Si inconnu, mettre 'Général'.",
          ),
        category: z
          .enum(["Dev", "Design", "Réunion", "Marketing", "Autre"])
          .describe("La catégorie principale qui correspond à l'activité."),
        duration: z
          .number()
          .describe(
            "La durée totale calculée en heures décimales. Exemple : 1h30 devient 1.5, 45min devient 0.75.",
          ),
      }),
      prompt: `Analyse le résumé d'activité quotidien suivant d'un freelance et extrait les données de manière structurée : "${rawText}"`,
    });

    // 4. Enregistrer l'activité extraite dans Neon DB via Prisma
    await db.log.create({
      data: {
        userId: user.id,
        rawText,
        projectName: object.projectName,
        category: object.category,
        duration: object.duration,
      },
    });

    // 5. Rafraîchir instantanément l'affichage du Dashboard
    revalidatePath("/dashboard");

    return { success: true, data: object };
  } catch (error) {
    console.error("Erreur lors de l'analyse IA :", error);
    return { success: false, error: "Impossible d'analyser votre journée." };
  }
}
