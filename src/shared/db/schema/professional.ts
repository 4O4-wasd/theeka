import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const professional = sqliteTable("professional", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    userId: text("user_id")
        .unique()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    phoneNumbers: text("phone_numbers", {
        mode: "json",
    })
        .$type<number[]>()
        .notNull(),
    professionalName: text("professional_name").notNull(),
    bio: text("bio"),    createdAt: integer("created_at", { mode: "timestamp_ms" })
            .notNull()
            .$defaultFn(() => new Date()),
});

export const professionalRelations = relations(professional, ({ one }) => ({
    user: one(user, {
        fields: [professional.userId],
        references: [user.id],
    }),
}));
