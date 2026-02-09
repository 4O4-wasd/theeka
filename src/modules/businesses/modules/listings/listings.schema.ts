import { businessListingsSchema } from "@/db/tables";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const schema = {
    service() {
        return {
            create: {
                input: businessListingsSchema.omit({
                    id: true,
                    createdAt: true,
                }),

                output: businessListingsSchema.omit({
                    businessId: true,
                }),
            },

            find: {
                input: businessListingsSchema.pick({
                    id: true,
                    businessId: true,
                }),

                output: businessListingsSchema.omit({
                    businessId: true,
                }),
            },

            findAll: {
                input: businessListingsSchema.pick({ businessId: true }),

                output: z.array(
                    businessListingsSchema.omit({
                        businessId: true,
                    }),
                ),
            },

            update: {
                input: businessListingsSchema
                    .omit({
                        createdAt: true,
                    })
                    .partial()
                    .required({
                        businessId: true,
                        id: true,
                    }),

                output: businessListingsSchema.omit({
                    businessId: true,
                }),
            },

            delete: {
                input: businessListingsSchema.pick({
                    id: true,
                    businessId: true,
                }),
            },
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            "POST /": {
                description: "Create A Business Listing",
                request: {
                    json: this.service().create.input.omit({
                        businessId: true,
                    }),
                },
                response: {
                    Created: this.service().create.output,
                },
            },

            "GET /:listingId": {
                description: "Find A Listing",
                request: {
                    param: z.object({
                        listingId: z.uuid(),
                    }),
                },
                response: {
                    OK: this.service().find.output,
                },
            },

            "GET /": {
                description: "Find All Listings",
                request: {},
                response: {
                    OK: this.service().findAll.output,
                },
            },

            "PATCH /:listingId": {
                description: "Update A Listing",
                request: {
                    param: z.object({
                        listingId: z.uuid(),
                    }),
                    json: this.service().update.input.omit({
                        id: true,
                        businessId: true,
                    }),
                },
                response: {
                    OK: this.service().update.output,
                },
            },

            "DELETE /:listingId": {
                description: "Delete A Listing",
                request: {
                    param: z.object({
                        listingId: z.uuid(),
                    }),
                },
                response: {
                    OK: z.object({
                        success: z.literal(true),
                    }),
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const listingsRouteSchema = schema.route();

type ListingsSchemaType = InferSchema<typeof schema>;

export type ListingsServiceSchemaType = ListingsSchemaType["service"];
