import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businessListings } from "./business-listings.schema";
import { businesses } from "./businesses.schema";
import { users } from "./users.schema";

export const views = sqliteTable("views", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    businessId: text("business_id")
        .references(() => businesses.id, { onDelete: "cascade" })
        .notNull(),
    listingId: text("listing_id")
        .references(() => businessListings.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const viewsRelations = relations(views, ({ one, many }) => ({
    user: one(users, {
        fields: [views.userId],
        references: [users.id],
    }),
    business: one(businesses, {
        fields: [views.userId],
        references: [businesses.id],
    }),
    listing: one(businessListings, {
        fields: [views.listingId],
        references: [businessListings.id],
    }),
}));
