import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";
import { accounts } from "./accounts.schema";

export const sessions = sqliteTable("sessions", {
    token: text("token").primaryKey(),
    userAgent: text("user_agent").notNull(),
    ipAddress: text("ip_address").notNull(),
    accountId: text("account_id")
        .references(() => accounts.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .$default(() => new Date()),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
    account: one(accounts, {
        fields: [sessions.accountId],
        references: [accounts.id],
    }),
}));

export const sessionSchema = z.object({
    token: z.base64(),
    userAgent: z.string(),
    ipAddress: z.ipv4(),
    accountId: z.uuid(),
    createdAt: z.iso.datetime(),
});

export type SessionSchemaType = z.infer<typeof sessionSchema>;
