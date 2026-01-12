import { defineConfig } from "drizzle-kit";
import env from "@env";

export default defineConfig({
    dialect: "turso",
    schema: "src/db/schema/index.ts",
    out: ".drizzle",
    dbCredentials: {
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN,
    },
    
});
