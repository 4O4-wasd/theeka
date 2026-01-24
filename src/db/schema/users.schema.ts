import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";
import { accounts, accountSchema } from "./accounts.schema";
import { businesses } from "./businesses.schema";
import { employees } from "./employees.schema";
import { orders } from "./orders.schema";
import { reviews } from "./reviews.schema";
import { userAddresses } from "./user-addresses.schema";

export const users = sqliteTable("users", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    name: text("name").notNull(),
    avatar: text("avatar"),
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
    name: z.string().min(2),
    avatar: z.url().optional().nullable(),
    accountId: accountSchema.shape.id,
});

export type UserSchemaType = z.infer<typeof userSchema>;
