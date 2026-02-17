import { configDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";

configDotenv({ path: "./.env.local" });

export default defineConfig({
    dialect: "postgresql", // هذه الخاصية مطلوبة
    schema: "./lib/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});