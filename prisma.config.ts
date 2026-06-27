import { defineConfig } from "@prisma/config";
import "dotenv/config"; // 👈 Ajoute cette ligne pour charger ton fichier .env

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
