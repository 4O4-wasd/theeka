import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "prod"]).default("prod"),
    DATABASE_URL: z.string(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const env = envSchema.parse(process.env);

export default env;
