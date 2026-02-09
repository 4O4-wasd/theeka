import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businessListingsTable } from "./business-listings.table";
import { businessesTable } from "./businesses.table";
import { usersTable } from "./users.table";

export const reviewsTable = sqliteTable("reviews", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    rating: integer("rating").$type<0 | 1 | 2 | 3 | 4 | 5>().notNull(),
    title: text("title").notNull(),
    comment: text("comment").notNull(),
    userId: text("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    businessId: text("business_id")
        .references(() => businessesTable.id, { onDelete: "cascade" })
        .notNull(),
    listingId: text("listing_id")
        .references(() => businessListingsTable.id, { onDelete: "cascade" })
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

export const reviewsTableRelations = relations(
    reviewsTable,
    ({ one, many }) => ({
        user: one(usersTable, {
            fields: [reviewsTable.userId],
            references: [usersTable.id],
        }),
        business: one(businessesTable, {
            fields: [reviewsTable.userId],
            references: [businessesTable.id],
        }),
        listing: one(businessListingsTable, {
            fields: [reviewsTable.listingId],
            references: [businessListingsTable.id],
        }),
    }),
);
