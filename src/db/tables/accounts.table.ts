import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { sessionsTable } from "./sessions.table";
import { usersTable } from "./users.table";

export const accountsTable = sqliteTable("accounts", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    phone: integer("phone").notNull().unique(),
    password: text("password").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const accountsTableRelations = relations(
    accountsTable,
    ({ many, one }) => ({
        sessions: many(sessionsTable),
        user: one(usersTable),
    }),
);

export const accountSchema = createSelectSchema(accountsTable, {
    id: z.uuid(),
    phone: z
        .number()
        .min(1000000000, "phone is not valid")
        .max(9999999999, "phone is not valid"),
    password: z.string().min(6).max(128),
    createdAt: z.date(),
});
