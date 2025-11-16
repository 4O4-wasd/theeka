import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { business } from "./business";

export const review = sqliteTable("review", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    serviceId: text("service_id")
        .notNull()
        .references(() => business.id, { onDelete: "cascade" }),
    reviewerId: text("reviewer_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    media: text("media", {
        mode: "json",
    }).$type<{ type: "img" | "vid"; url: string }[]>(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const reviewRelations = relations(review, ({ one }) => ({
    service: one(business, {
        fields: [review.serviceId],
        references: [business.id],
    }),
    reviewer: one(user, {
        fields: [review.reviewerId],
        references: [user.id],
    }),
}));
