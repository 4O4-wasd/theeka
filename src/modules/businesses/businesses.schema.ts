import { businessSchema } from "@/db/schema";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const businessesSchema = {
    service() {
        return {
            create: {
                input: businessSchema.omit({
                    id: true,
                    createdAt: true,
                    isClosed: true,
                }),

                output: businessSchema.omit({
                    ownerId: true,
                }),
            },

            find: {
                input: businessSchema.pick({ id: true, ownerId: true }),

                output: businessSchema.omit({
                    ownerId: true,
                }),
            },

            findAll: {
                input: businessSchema.pick({ ownerId: true }),

                output: z.array(
                    businessSchema.omit({
                        ownerId: true,
                    }),
                ),
            },

            update: {
                input: businessSchema
                    .omit({
                        createdAt: true,
                    })
                    .partial()
                    .required({
                        ownerId: true,
                        id: true,
                    }),

                output: businessSchema.omit({
                    ownerId: true,
                }),
            },

            delete: {
                input: businessSchema.pick({
                    id: true,
                    ownerId: true,
                }),
            },
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            "POST /": {
                description: "Create A Business",
                request: {
                    json: this.service().create.input.omit({
                        ownerId: true,
                    }),
                },
                response: {
                    Created: this.service().create.output,
                },
            },

            "GET /:businessId": {
                description: "Find A Business",
                request: {
                    param: z.object({
                        businessId: z.uuid(),
                    }),
                },
                response: {
                    OK: this.service().find.output,
                },
            },

            "GET /": {
                description: "Find All Businesses",
                request: {},
                response: {
                    OK: this.service().findAll.output,
                },
            },

            "PATCH /:businessId": {
                description: "Update A Business",
                request: {
                    param: z.object({
                        businessId: z.uuid(),
                    }),

                    json: this.service().update.input.omit({
                        id: true,
                        ownerId: true,
                    }),
                },
                response: {
                    OK: this.service().update.output,
                },
            },

            "DELETE /:businessId": {
                description: "Delete A Business",
                request: {
                    param: z.object({
                        businessId: z.uuid(),
                    }),
                },

                response: {
                    OK: z.object({
                        success: z.boolean().default(true),
                    }),
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const businessesRouteSchema = businessesSchema.route();

type BusinessesSchemaType = InferSchema<typeof businessesSchema>;

export type BusinessesServiceSchemaType = BusinessesSchemaType["service"];
