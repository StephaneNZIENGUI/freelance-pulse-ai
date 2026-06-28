// src/actions/log-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Supprime une activité, après avoir vérifié qu'elle appartient bien
 * à l'utilisateur actuellement connecté.
 */
export async function deleteLog(logId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Non autorisé");

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error("Utilisateur introuvable en BDD");

    const log = await db.log.findUnique({ where: { id: logId } });
    if (!log || log.userId !== user.id) {
      throw new Error("Activité introuvable ou accès refusé");
    }

    await db.log.delete({ where: { id: logId } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du log :", error);
    return { success: false, error: "Impossible de supprimer cette activité." };
  }
}

/**
 * Met à jour une activité existante, après vérification d'appartenance.
 */
export async function updateLog(
  logId: string,
  data: {
    projectName: string;
    category: string;
    duration: number;
    rawText: string;
  }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Non autorisé");

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error("Utilisateur introuvable en BDD");

    const log = await db.log.findUnique({ where: { id: logId } });
    if (!log || log.userId !== user.id) {
      throw new Error("Activité introuvable ou accès refusé");
    }

    await db.log.update({
      where: { id: logId },
      data: {
        projectName: data.projectName,
        category: data.category,
        duration: data.duration,
        rawText: data.rawText,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification du log :", error);
    return { success: false, error: "Impossible de modifier cette activité." };
  }
}