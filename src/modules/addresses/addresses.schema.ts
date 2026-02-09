import { userAddressSchema } from "@/db/tables";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import { z } from "zod";

const schema = {
    service() {
        return {
            create: {
                input: userAddressSchema.omit({
                    id: true,
                }),

                output: userAddressSchema.omit({
                    userId: true,
                }),
            },

            find: {
                input: userAddressSchema.pick({
                    id: true,
                    userId: true,
                }),

                output: userAddressSchema.omit({
                    userId: true,
                }),
            },

            update: {
                input: userAddressSchema.partial().required({
                    userId: true,
                    id: true,
                }),

                output: userAddressSchema.omit({
                    userId: true,
                }),
            },

            delete: {
                input: userAddressSchema.pick({
                    id: true,
                    userId: true,
                }),
            },

            findAll: {
                input: userAddressSchema.pick({
                    userId: true,
                }),

                output: z.array(
                    userAddressSchema.omit({
                        userId: true,
                    }),
                ),
            },
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            "POST /": {
                description: "Create An Addresses",

                request: {
                    json: this.service().create.input.omit({
                        userId: true,
                    }),
                },

                response: {
                    Created: this.service().create.output,
                },
            },

            "GET /:addressId": {
                description: "Find An Address",

                request: {
                    param: z.object({
                        addressId: z.uuid(),
                    }),
                },

                response: {
                    OK: this.service().find.output,
                },
            },

            "PATCH /:addressId": {
                description: "Update An Address",

                request: {
                    param: z.object({
                        addressId: z.uuid(),
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

            "DELETE /:addressId": {
                description: "Delete An Address",

                request: {
                    param: z.object({
                        addressId: z.uuid(),
                    }),
                },

                response: {
                    OK: z.object({
                        success: z.literal(true),
                    }),
                },
            },

            "GET /": {
                description: "Find All Addresses",

                request: {},

                response: {
                    OK: this.service().findAll.output,
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const addressesRouteSchema = schema.route();

type AddressesSchemaType = InferSchema<typeof schema>;

export type AddressesServiceSchemaType = AddressesSchemaType["service"];
