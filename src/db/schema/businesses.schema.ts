import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businessAddresses } from "./business-addresses.schema";
import { employees } from "./employees.schema";
import { orders } from "./orders.schema";
import { reviews } from "./reviews.schema";
import { users } from "./users.schema";

type BusinessHours = Record<
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday",
    `${number}:${number}-${number}:${number}` | "closed" | "24 hours"
>;

export const businesses = sqliteTable("businesses", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    ownerId: text("owner_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    phoneNumbers: text("phone_numbers", {
        mode: "json",
    })
        .$type<number[]>()
        .notNull(),
    businessHours: text("business_hours", {
        mode: "json",
    })
        .$type<BusinessHours>()
        .notNull(),
    timezone: text("timezone").notNull(),
    media: text("media", {
        mode: "json",
    }).$type<
        {
            type: "image" | "video";
            url: string;
        }[]
    >(),
    isClosed: integer("is_closed", {
        mode: "boolean",
    })
        .notNull()
        .default(false),
    title: text("title").notNull(),
    logo: text("logo"),
    description: text("description"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const businessesRelations = relations(businesses, ({ one, many }) => ({
    owner: one(users, {
        fields: [businesses.ownerId],
        references: [users.id],
    }),
    address: one(businessAddresses),
    employees: many(employees),
    orders: many(orders),
    reviews: many(reviews),
}));
