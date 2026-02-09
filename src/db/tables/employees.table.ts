import { relations } from "drizzle-orm";
import {
    integer,
    primaryKey,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { businessesTable } from "./businesses.table";
import { ordersTable } from "./orders.table";
import { usersTable } from "./users.table";

export const employeesTable = sqliteTable(
    "employees",
    {
        userId: text("user_id")
            .references(() => usersTable.id, { onDelete: "cascade" })
            .notNull(),
        businessId: text("business_id")
            .references(() => businessesTable.id, { onDelete: "cascade" })
            .notNull(),
        role: text("role", {
            enum: ["manager", "staff"],
        })
            .default("staff")
            .notNull(),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .$defaultFn(() => new Date()),
    },
    (t) => [
        primaryKey({
            columns: [t.businessId, t.userId],
        }),
    ],
);

export const employeesRelations = relations(
    employeesTable,
    ({ one, many }) => ({
        user: one(usersTable, {
            fields: [employeesTable.userId],
            references: [usersTable.id],
        }),
        business: one(businessesTable, {
            fields: [employeesTable.businessId],
            references: [businessesTable.id],
        }),
        orders: many(ordersTable),
    }),
);

export const employeesSchema = createSelectSchema(employeesTable, {
    userId: z.uuid(),
    businessId: z.uuid(),
    createdAt: z.date(),
    role: z.enum(["manager", "staff"]),
});
