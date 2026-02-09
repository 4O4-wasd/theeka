import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { accountsTable } from "./accounts.table";
import { businessesTable } from "./businesses.table";
import { employeesTable } from "./employees.table";
import { ordersTable } from "./orders.table";
import { reviewsTable } from "./reviews.table";
import { userAddressesTable } from "./user-addresses.table";

export const usersTable = sqliteTable("users", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    name: text("name").notNull(),
    avatar: text("avatar"),
    accountId: text("account_id")
        .unique()
        .references(() => accountsTable.id, { onDelete: "cascade" })
        .notNull(),
});

export const usersTableRelations = relations(usersTable, ({ one, many }) => ({
    account: one(accountsTable, {
        fields: [usersTable.accountId],
        references: [accountsTable.id],
    }),
    employeesProfiles: many(employeesTable),
    businesses: many(businessesTable),
    addresses: many(userAddressesTable),
    orders: many(ordersTable),
    reviews: many(reviewsTable),
}));

export const userSchema = createSelectSchema(usersTable, {
    id: z.uuid(),
    name: z.string().min(2),
    avatar: z.url().optional().nullable(),
    accountId: z.uuid(),
});

export type UserSchemaType = z.infer<typeof userSchema>;
