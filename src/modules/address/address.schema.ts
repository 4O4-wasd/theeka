import { userAddressSchema } from "@/db/schema";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import { z } from "zod";

const addressSchema = {
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
        } satisfies DefaultSchemaType.Repository;
    },

    service() {
        return {
            create: this.repository().create,
            find: this.repository().find,
            update: this.repository().update,
            delete: this.repository().delete,
            findAll: this.repository().findAll,
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            create: {
                request: {
                    json: this.service().create.input.omit({
                        userId: true,
                    }),
                },

                response: {
                    Created: this.service().create.output,
                },
            },

            find: {
                request: {
                    param: z.object({
                        addressId: z.uuid(),
                    }),
                },

                response: {
                    OK: this.service().find.output,
                },
            },

            update: {
                request: {
                    param: z.object({
                        addressId: z.uuid(),
                    }),

                    json: this.service().update.input.omit({
                        id: true,
                    }),
                },

                response: {
                    OK: this.service().update.output,
                },
            },

            delete: {
                request: {
                    param: z.object({
                        addressId: z.uuid(),
                    }),
                },

                response: {
                    OK: z.object({
                        success: z.boolean().default(true),
                    }),
                },
            },

            findAll: {
                response: {
                    OK: this.service().findAll.output,
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const addressRouteSchema = addressSchema.route();

type AddressSchemaType = InferSchema<typeof addressSchema>;

export type AddressRepositorySchemaType = AddressSchemaType["repository"];
export type AddressServiceSchemaType = AddressSchemaType["service"];
