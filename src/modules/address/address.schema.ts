import { userAddressSchema } from "@/db/schema";
import { HTTP_STATUS } from "@/status-codes";
import type { InferSchema } from "@/utils";
import { z } from "zod";

export const addressSchema = {
    repository() {
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

                output: userAddressSchema
                    .omit({
                        userId: true,
                    })
                    .optional(),
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
        };
    },

    service() {
        return {
            create: this.repository().create,
            find: this.repository().find,
            update: this.repository().update,
            delete: this.repository().delete,
            findAll: this.repository().findAll,
        };
    },

    route() {
        return {
            create: {
                json: this.service().create.input.omit({
                    userId: true,
                }),

                [HTTP_STATUS["Created"]]: this.service().create.output,
            },

            find: {
                param: this.service().find.input.pick({
                    id: true,
                }),

                [HTTP_STATUS["OK"]]: this.service().find.output,
            },

            update: {
                param: this.service().update.input.pick({
                    id: true,
                }),

                json: this.service().update.input.omit({
                    userId: true,
                    id: true,
                }),

                [HTTP_STATUS["OK"]]: this.service().update.output,
            },

            delete: {
                params: this.service().delete.input.pick({
                    id: true,
                }),

                [HTTP_STATUS["No Content"]]: z.void(),
            },

            findAll: {
                [HTTP_STATUS["OK"]]: this.service().findAll.output,
            },
        };
    },
};

export const addressRouteSchema = addressSchema.route();

export type AddressSchemaType = InferSchema<typeof addressSchema>;
export type AddressRepositorySchemaType = InferSchema<
    typeof addressSchema
>["repository"];
export type AddressServiceSchemaType = InferSchema<
    typeof addressSchema
>["service"];
