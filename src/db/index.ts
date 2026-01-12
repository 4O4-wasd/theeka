import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import env from "@env";

const db = drizzle({
    connection: {
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN,
    },
    schema,
});

export default db;
