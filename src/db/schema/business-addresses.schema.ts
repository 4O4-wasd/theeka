import { relations } from "drizzle-orm";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businesses } from "./businesses.schema";

export const businessAddresses = sqliteTable("business_addresses", {
    businessId: text("business_id")
        .primaryKey()
        .references(() => businesses.id, { onDelete: "cascade" })
        .notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    landmark: text("landmark"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: text("pincode").notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    minLatitude: real("min_latitude").notNull(),
    maxLatitude: real("max_latitude").notNull(),
    minLongitude: real("min_longitude").notNull(),
    maxLongitude: real("max_longitude").notNull(),
});

export const businessListingAddressRelations = relations(
    businessAddresses,
    ({ one, many }) => ({
        business: one(businesses, {
            fields: [businessAddresses.businessId],
            references: [businesses.id],
        }),
    })
);
