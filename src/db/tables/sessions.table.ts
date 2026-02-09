import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { accountsTable } from "./accounts.table";

export const sessionsTable = sqliteTable("sessions", {
    token: text("token").primaryKey(),
    userAgent: text("user_agent").notNull(),
    ipAddress: text("ip_address").notNull(),
    accountId: text("account_id")
        .references(() => accountsTable.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
        .notNull()
        .$default(() => new Date()),
});

export const sessionsTableRelations = relations(sessionsTable, ({ one }) => ({
    account: one(accountsTable, {
        fields: [sessionsTable.accountId],
        references: [accountsTable.id],
    }),
}));

export const sessionSchema = createSelectSchema(sessionsTable, {
    token: z.base64(),
    userAgent: z.string(),
    ipAddress: z.ipv4(),
    accountId: z.uuid(),
    createdAt: z.date(),
});

export type SessionSchemaType = z.infer<typeof sessionSchema>;
