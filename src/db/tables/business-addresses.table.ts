import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { businessesTable } from "./businesses.table";

export const businessAddressesTable = sqliteTable("business_addresses", {
    businessId: text("business_id")
        .primaryKey()
        .references(() => businessesTable.id, { onDelete: "cascade" })
        .notNull(),

    completeAddress: text("complete_address").notNull(),

    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: integer("pincode").notNull(),

    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),

    minLatitude: real("min_latitude").notNull(),
    maxLatitude: real("max_latitude").notNull(),

    minLongitude: real("min_longitude").notNull(),
    maxLongitude: real("max_longitude").notNull(),
});

export const businessAddressTableRelations = relations(
    businessAddressesTable,
    ({ one, many }) => ({
        business: one(businessesTable, {
            fields: [businessAddressesTable.businessId],
            references: [businessesTable.id],
        }),
    }),
);

export const businessAddressSchema = createSelectSchema(
    businessAddressesTable,
    {
        businessId: z.uuid(),

        completeAddress: z.string(),

        city: z.string(),
        state: z.string(),
        pincode: z.number().min(111111).max(999999),

        latitude: z.number(),
        longitude: z.number(),

        minLatitude: z.number(),
        minLongitude: z.number(),

        maxLatitude: z.number(),
        maxLongitude: z.number(),
    },
);
