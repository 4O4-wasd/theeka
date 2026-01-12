import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businessListings } from "./business-listings.schema";
import { businesses } from "./businesses.schema";
import { employees } from "./employees.schema";
import { userAddresses, userAddressSchema } from "./user-addresses.schema";
import { users, userSchema } from "./users.schema";
import z from "zod";

export const orders = sqliteTable("orders", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    customerPhone: integer("customer_phone").notNull(),
    status: text("status", {
        enum: [
            "placed",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "in_progress",
            "completed",
            "cancelled",
        ],
    })
        .notNull()
        .default("placed"),
    cancellationReason: text("cancellation_reason"),
    quantity: integer("quantity").notNull().default(1),
    estimatedArrivalTime: text("estimated_arrival_time").$type<`${
        | number
        | `${number}-${number}`}${"m" | "h" | "d" | "m" | "y"}`>(),
    customerNotes: text("customer_notes"),
    shopNotes: text("shop_notes"),
    customerId: text("customer_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    addressId: text("address_id")
        .notNull()
        .references(() => userAddresses.id, { onDelete: "cascade" }),
    businessId: text("business_id")
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
        .notNull()
        .references(() => businessListings.id, { onDelete: "cascade" }),
    deliveryEmployeeId: text("delivery_employee_id")
        .notNull()
        .references(() => employees.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
    customer: one(users, {
        fields: [orders.customerId],
        references: [users.id],
    }),
    address: one(userAddresses, {
        fields: [orders.addressId],
        references: [userAddresses.id],
    }),
    business: one(businesses, {
        fields: [orders.businessId],
        references: [businesses.id],
    }),
    listing: one(businessListings, {
        fields: [orders.listingId],
        references: [businessListings.id],
    }),
    deliveryEmployee: one(employees, {
        fields: [orders.deliveryEmployeeId],
        references: [employees.id],
    }),
}));

export const orderSchema = z.object({
    id: z.uuid(),
    customerPhone: z.number(),
    status: z
        .enum([
            "placed",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "in_progress",
            "completed",
            "cancelled",
        ])
        .default("placed"),
    cancellationReason: z.string().nullable(),
    quantity: z.number(),
    estimatedArrivalTime: z.string().nullable(),
    customerNotes: z.string().nullable(),
    shopNotes: z.string().nullable(),
    customerId: z.uuid(),
    addressId: z.uuid(),
    businessId: z.uuid(),
    listingId: z.uuid(),
    deliveryEmployeeId: z.uuid(),
    createdAt: z.date(),
});

export type OrderSchemaType = z.infer<typeof orderSchema>;
