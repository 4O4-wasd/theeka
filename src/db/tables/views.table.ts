import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businessListingsTable } from "./business-listings.table";
import { businessesTable } from "./businesses.table";
import { usersTable } from "./users.table";

export const viewsTable = sqliteTable("views", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    userId: text("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    businessId: text("business_id")
        .references(() => businessesTable.id, { onDelete: "cascade" })
        .notNull(),
    listingId: text("listing_id")
        .references(() => businessListingsTable.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const viewsTableRelations = relations(viewsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [viewsTable.userId],
        references: [usersTable.id],
    }),
    business: one(businessesTable, {
        fields: [viewsTable.userId],
        references: [businessesTable.id],
    }),
    listing: one(businessListingsTable, {
        fields: [viewsTable.listingId],
        references: [businessListingsTable.id],
    }),
}));
