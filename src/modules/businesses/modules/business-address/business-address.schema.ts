import { businessAddressSchema } from "@/db/tables";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const schema = {
    service() {
        return {
            create: {
                input: businessAddressSchema,
                output: businessAddressSchema.omit({
                    businessId: true,
                }),
            },

            find: {
                input: businessAddressSchema.pick({
                    businessId: true,
                }),
                output: businessAddressSchema.omit({
                    businessId: true,
                }),
            },

            update: {
                input: businessAddressSchema.partial().required({
                    businessId: true,
                }),
                output: businessAddressSchema.omit({
                    businessId: true,
                }),
            },

            delete: {
                input: businessAddressSchema.pick({
                    businessId: true,
                }),
            },
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            "POST /": {
                description: "Create Address",

                request: {
                    json: this.service().create.input.omit({
                        businessId: true,
                    }),
                },

                response: {
                    Created: this.service().create.output,
                },
            },

            "GET /": {
                description: "Find Address",

                request: {},

                response: {
                    OK: this.service().find.output,
                },
            },

            "PATCH /": {
                description: "Update Address",

                request: {
                    json: this.service().update.input.omit({
                        businessId: true,
                    }),
                },

                response: {
                    OK: this.service().update.output,
                },
            },

            "DELETE /": {
                description: "Delete Address",

                request: {},

                response: {
                    OK: z.object({
                        success: z.literal(true),
                    }),
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const businessAddressRouteSchema = schema.route();

type BusinessAddressSchemaType = InferSchema<typeof schema>;

export type BusinessAddressServiceSchemaType =
    BusinessAddressSchemaType["service"];
