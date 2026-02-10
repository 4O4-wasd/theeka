import { employeesSchema, userSchema } from "@/db/tables";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const schema = {
    service() {
        return {
            create: {
                input: employeesSchema.omit({
                    createdAt: true,
                }),

                output: employeesSchema
                    .omit({
                        businessId: true,
                        userId: true,
                    })
                    .extend({
                        user: userSchema.omit({
                            accountId: true,
                        }),
                    }),
            },

            find: {
                input: employeesSchema.pick({
                    userId: true,
                    businessId: true,
                }),

                output: employeesSchema
                    .omit({
                        userId: true,
                        businessId: true,
                    })
                    .extend({
                        user: userSchema.omit({
                            accountId: true,
                        }),
                    }),
            },

            findAll: {
                input: employeesSchema.pick({ businessId: true }),

                output: z.array(
                    employeesSchema
                        .omit({
                            userId: true,
                            businessId: true,
                        })
                        .extend({
                            user: userSchema.omit({
                                accountId: true,
                            }),
                        }),
                ),
            },

            update: {
                input: employeesSchema
                    .omit({
                        createdAt: true,
                    })
                    .partial()
                    .required({
                        userId: true,
                        businessId: true,
                    }),

                output: employeesSchema
                    .omit({
                        userId: true,
                        businessId: true,
                    })
                    .extend({
                        user: userSchema.omit({
                            accountId: true,
                        }),
                    }),
            },

            delete: {
                input: employeesSchema.pick({
                    userId: true,
                    businessId: true,
                }),
            },
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            "POST /": {
                description: "Create An Employee",
                request: {
                    json: this.service().create.input.omit({
                        businessId: true,
                    }),
                },
                response: {
                    Created: this.service().create.output,
                },
            },

            "GET /:employeeUserId": {
                description: "Find An Employee",
                request: {
                    param: z.object({
                        employeeUserId: z.uuid(),
                    }),
                },
                response: {
                    OK: this.service().find.output,
                },
            },

            "GET /": {
                description: "Find All Employees",
                request: {},
                response: {
                    OK: this.service().findAll.output,
                },
            },

            "PATCH /:employeeUserId": {
                description: "Update An Employee",
                request: {
                    param: z.object({
                        employeeUserId: z.uuid(),
                    }),
                    json: this.service().update.input.omit({
                        userId: true,
                        businessId: true,
                    }),
                },
                response: {
                    OK: this.service().update.output,
                },
            },

            "DELETE /:employeeUserId": {
                description: "Delete An Employee",
                request: {
                    param: z.object({
                        employeeUserId: z.uuid(),
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

export const employeesRouteSchema = schema.route();
export const employeesServiceSchema = schema.service();

type EmployeesSchemaType = InferSchema<typeof schema>;

export type EmployeesServiceSchemaType = EmployeesSchemaType["service"];
