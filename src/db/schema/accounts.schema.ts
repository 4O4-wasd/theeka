import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";
import { sessions } from "./sessions.schema";
import { users } from "./users.schema";

export const accounts = sqliteTable("accounts", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    phone: integer("phone").notNull().unique(),
    password: text("password").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(
        () => new Date()
    ),
});

export const accountsRelations = relations(accounts, ({ many, one }) => ({
    sessions: many(sessions),
    user: one(users),
}));

export const accountSchema = z.object({
    id: z.uuid(),
    phone: z
        .number()
        .min(1000000000, "phone is not valid")
        .max(9999999999, "phone is not valid"),
    password: z.string().min(6).max(128),
    createdAt: z.iso.datetime(),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;
