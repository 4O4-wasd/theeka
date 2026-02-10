import { businessSchema } from "@/db/tables";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const businessesSchema = {
    service() {
        return {
            create: {
                input: businessSchema
                    .omit({
                        id: true,
                        createdAt: true,
                        isClosed: true,
                    })
                    .extend({
                        userId: z.uuid(),
                    }),

                output: businessSchema,
            },

            find: {
                input: businessSchema.pick({ id: true }),

                output: businessSchema,
            },

            findAll: {
                input: z.object({
                    userId: z.uuid(),
                }),

                output: z.array(businessSchema),
            },

            update: {
                input: businessSchema
                    .omit({
                        createdAt: true,
                    })
                    .partial()
                    .required({
                        id: true,
                    })
                    .extend({
                        userId: z.uuid(),
                    }),

                output: businessSchema,
            },

            delete: {
                input: businessSchema
                    .pick({
                        id: true,
                    })
                    .extend({
                        userId: z.uuid(),
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
                        userId: true,
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
                description: "Find All Businesses That You Joined In",

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
                        userId: true,
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
                        success: z.literal(true),
                    }),
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const businessesRouteSchema = businessesSchema.route();

type BusinessesSchemaType = InferSchema<typeof businessesSchema>;

export type BusinessesServiceSchemaType = BusinessesSchemaType["service"];
