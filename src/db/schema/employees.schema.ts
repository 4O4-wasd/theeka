import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businesses } from "./businesses.schema";
import { orders } from "./orders.schema";
import { users } from "./users.schema";

export const employees = sqliteTable("employees", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    role: text("role", {
        enum: ["manager", "staff"],
    }).default("staff"),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    businessId: text("business_id")
        .references(() => businesses.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const employeesRelations = relations(employees, ({ one, many }) => ({
    user: one(users, {
        fields: [employees.userId],
        references: [users.id],
    }),
    business: one(businesses, {
        fields: [employees.businessId],
        references: [businesses.id],
    }),
    orders: many(orders),
}));
