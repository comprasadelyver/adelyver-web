import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/features/implementations/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: { url: process.env.DATABASE_URL! },
});
