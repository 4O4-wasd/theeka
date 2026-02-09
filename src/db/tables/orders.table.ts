import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { businessListingsTable } from "./business-listings.table";
import { businessesTable } from "./businesses.table";
import { employeesTable } from "./employees.table";
import { userAddressesTable } from "./user-addresses.table";
import { usersTable } from "./users.table";

export const ordersTable = sqliteTable("orders", {
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
        .references(() => usersTable.id, { onDelete: "cascade" }),
    addressId: text("address_id")
        .notNull()
        .references(() => userAddressesTable.id, { onDelete: "cascade" }),
    businessId: text("business_id")
        .notNull()
        .references(() => businessesTable.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
        .notNull()
        .references(() => businessListingsTable.id, { onDelete: "cascade" }),
    deliveryEmployeeId: text("delivery_employee_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const ordersTableRelations = relations(ordersTable, ({ one, many }) => ({
    customer: one(usersTable, {
        fields: [ordersTable.customerId],
        references: [usersTable.id],
    }),
    address: one(userAddressesTable, {
        fields: [ordersTable.addressId],
        references: [userAddressesTable.id],
    }),
    business: one(businessesTable, {
        fields: [ordersTable.businessId],
        references: [businessesTable.id],
    }),
    listing: one(businessListingsTable, {
        fields: [ordersTable.listingId],
        references: [businessListingsTable.id],
    }),
    deliveryEmployee: one(employeesTable, {
        fields: [ordersTable.deliveryEmployeeId],
        references: [employeesTable.userId],
    }),
}));

export const orderSchema = createSelectSchema(ordersTable, {
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
