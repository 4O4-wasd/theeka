import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { ordersTable } from "./orders.table";
import { usersTable } from "./users.table";

export const userAddressesTable = sqliteTable("user_addresses", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    name: text("name").notNull(),
    userId: text("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),

    completeAddress: text("complete_address").notNull(),

    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: integer("pincode").notNull(),

    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
});

export const userAddressesTableRelations = relations(
    userAddressesTable,
    ({ one, many }) => ({
        user: one(usersTable, {
            fields: [userAddressesTable.userId],
            references: [usersTable.id],
        }),
        orders: many(ordersTable),
    }),
);

export const userAddressSchema = createSelectSchema(userAddressesTable, {
    id: z.uuid(),
    name: z.string(),
    userId: z.uuid(),

    completeAddress: z.string(),

    city: z.string(),
    state: z.string(),
    pincode: z.number().min(111111).max(999999),
    latitude: z.number(),
    longitude: z.number(),
});

export type UserAddressSchemaType = z.infer<typeof userAddressSchema>;
