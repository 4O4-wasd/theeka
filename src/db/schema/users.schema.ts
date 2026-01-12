import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accounts, accountSchema } from "./accounts.schema";
import { businesses } from "./businesses.schema";
import { employees } from "./employees.schema";
import { orders, orderSchema } from "./orders.schema";
import { reviews } from "./reviews.schema";
import { userAddresses } from "./user-addresses.schema";
import z from "zod";

export const users = sqliteTable("users", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    name: text("name").notNull(),
    avatar: text("avatar").notNull().default(""),
    accountId: text("account_id")
        .unique()
        .references(() => accounts.id, { onDelete: "cascade" })
        .notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    account: one(accounts, {
        fields: [users.accountId],
        references: [accounts.id],
    }),
    employeesProfiles: many(employees),
    businesses: many(businesses),
    addresses: many(userAddresses),
    orders: many(orders),
    reviews: many(reviews),
}));

export const userSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    avatar: z.string(),
    accountId: z.string(),
});

export type UserSchemaType = z.infer<typeof userSchema>;