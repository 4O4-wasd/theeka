import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { orders } from "./orders.schema";
import { users } from "./users.schema";

export const userAddresses = sqliteTable("user_addresses", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    name: text("name").notNull(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),

    completeAddress: text("complete_address").notNull(),

    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: integer("pincode").notNull(),

    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
});

export const userAddressesRelations = relations(
    userAddresses,
    ({ one, many }) => ({
        user: one(users, {
            fields: [userAddresses.userId],
            references: [users.id],
        }),
        orders: many(orders),
    }),
);

export const userAddressSchema = createSelectSchema(userAddresses, {
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
