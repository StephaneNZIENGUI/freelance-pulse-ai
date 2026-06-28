import "dotenv/config"; // sécurité supplémentaire si jamais ce fichier est exécuté seul
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL est introuvable. Vérifiez que `import \"dotenv/config\";` " +
        "est bien présent en haut de prisma.config.ts, et que .env contient DATABASE_URL."
    );
  }

  // Prisma 7 ne permet plus de passer une URL brute via `datasources`.
  // Il faut désormais passer par un driver adapter.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;