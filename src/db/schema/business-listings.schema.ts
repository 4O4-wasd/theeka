import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { businesses } from "./businesses.schema";
import { orders } from "./orders.schema";
import { reviews } from "./reviews.schema";

export const businessListings = sqliteTable("business_listings", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    businessId: text("business_id")
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    productSpecs: text("product_specs", {
        mode: "json",
    }).$type<Record<string, Record<string, string>>>(),
    logo: text("logo"),
    price: text("price").notNull(),
    categories: text("categories", {
        mode: "json",
    })
        .$type<string[]>()
        .notNull(),
    tags: text("tags", {
        mode: "json",
    })
        .$type<string[]>()
        .notNull(),
    type: text("type", {
        enum: ["product", "service"],
    }).notNull(),
    media: text("media", {
        mode: "json",
    }).$type<
        {
            type: "image" | "video";
            url: string;
        }[]
    >(),
    stock: integer("stock"),
    available: integer("available", { mode: "boolean" }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const businessListingRelations = relations(
    businessListings,
    ({ one, many }) => ({
        business: one(businesses, {
            fields: [businessListings.businessId],
            references: [businesses.id],
        }),
        orders: many(orders),
        reviews: many(reviews)
    })
);
