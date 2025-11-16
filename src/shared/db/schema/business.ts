import { City } from "@/shared/actions/search-location";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { professional } from "./professional";

export const businessCategory = sqliteTable("business_category", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    icon: text("icon"),
    numberOfServices: integer("number_of_services").default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const businessCategoryRelations = relations(
    businessCategory,
    ({ many }) => ({
        services: many(business),
    })
);

export const business = sqliteTable("business", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    professionalId: text("professional_id")
        .notNull()
        .references(() => professional.id, { onDelete: "cascade" }),
    // categoryName: text("category_name").notNull(),
    categoryNames: text("category_names", {
        mode: "json",
    })
        .$type<string[]>()
        .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location", {
        mode: "json",
    })
        .$type<City>()
        .notNull(),
    radius: integer("radius").notNull(),
    totalRating: integer("total_rating").default(0.0), // not ui
    totalReviews: integer("total_reviews").default(0), // not ui
    media: text("media", {
        mode: "json",
    })
        .$type<{ type: "image" | "video"; url: string }[]>()
        .notNull(),
    thumbnail: text("thumbnail").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const businessRelations = relations(business, ({ one, many }) => ({
    professional: one(professional, {
        fields: [business.professionalId],
        references: [professional.id],
    }),
    // category: one(businessCategory, {
    //     fields: [business.categoryName],
    //     references: [businessCategory.id],
    // }),
    // locations: many(businessLocations),
}));

// export const businessLocations = sqliteTable("business_locations", {
//     id: text("id")
//         .primaryKey()
//         .$default(() => crypto.randomUUID()),
//     serviceId: text("service_id")
//         .notNull()
//         .references(() => business.id, { onDelete: "cascade" }),
//     minLat: real("min_lat").notNull(),
//     minLong: real("min_long").notNull(),
//     maxLat: real("max_lat").notNull(),
//     maxLong: real("max_long").notNull(),
// });

// export const businessLocationsRelations = relations(
//     businessLocations,
//     ({ one }) => ({
//         service: one(business, {
//             fields: [businessLocations.serviceId],
//             references: [business.id],
//         }),
//     })
// );
