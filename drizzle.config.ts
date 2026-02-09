import env from "@env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "turso",
    schema: "src/db/tables/index.ts",
    out: ".drizzle",
    dbCredentials: {
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN,
    },
});
