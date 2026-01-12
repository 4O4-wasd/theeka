import { relations } from "drizzle-orm";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { orders, orderSchema } from "./orders.schema";
import { users, userSchema } from "./users.schema";
import z from "zod";

export const userAddresses = sqliteTable("user_addresses", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    name: text("name").notNull(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    landmark: text("landmark"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: text("pincode").notNull(),
    latitude: real("latitude"),
    longitude: real("longitude"),
});

export const userAddressesRelations = relations(
    userAddresses,
    ({ one, many }) => ({
        user: one(users, {
            fields: [userAddresses.userId],
            references: [users.id],
        }),
        orders: many(orders),
    })
);

export const userAddressSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    userId: z.uuid(),
    addressLine1: z.string(),
    addressLine2: z.string().nullable(),
    landmark: z.string().nullable(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
});

export type UserAddressSchemaType = z.infer<typeof userAddressSchema>;