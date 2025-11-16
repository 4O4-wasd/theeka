import { env } from "@/shared";
import { database } from "@/shared/db";
import * as schema from "@/shared/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(database, {
        provider: "sqlite",
        camelCase: true,
        schema,
        transaction: true,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_SECRET,
        },
        facebook: {
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_SECRET,
        },
    },
    plugins: [nextCookies()],
});
