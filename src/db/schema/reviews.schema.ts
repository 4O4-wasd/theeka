import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businessListings } from "./business-listings.schema";
import { businesses } from "./businesses.schema";
import { users } from "./users.schema";

export const reviews = sqliteTable("reviews", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    rating: integer("rating").$type<0 | 1 | 2 | 3 | 4 | 5>().notNull(),
    title: text("title").notNull(),
    comment: text("comment").notNull(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    businessId: text("business_id")
        .references(() => businesses.id, { onDelete: "cascade" })
        .notNull(),
    listingId: text("listing_id")
        .references(() => businessListings.id, { onDelete: "cascade" })
        .notNull(),
    media: text("media", {
        mode: "json",
    }).$type<
        {
            type: "image" | "video";
            url: string;
        }[]
    >(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
    business: one(businesses, {
        fields: [reviews.userId],
        references: [businesses.id],
    }),
    listing: one(businessListings, {
        fields: [reviews.listingId],
        references: [businessListings.id],
    }),
}));
