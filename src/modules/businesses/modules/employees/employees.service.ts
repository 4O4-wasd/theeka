import db from "@/db";
import { employeesTable } from "@/db/tables";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { EmployeesServiceSchemaType } from "./employees.schema";

export const employeesService = {
    async create(input) {
        const [[employee], user] = await db.batch([
            db
                .insert(employeesTable)
                .values(input)
                .returning(
                    selectTableColumns(employeesTable, "omit", {
                        businessId: true,
                        userId: true,
                    }),
                ),
            db.query.usersTable.findFirst({
                columns: {
                    accountId: false,
                },
                where: (t, { eq }) => eq(t.id, input.userId),
            }),
        ]);

        if (!user) {
            throw new HTTPException(HTTP_STATUS["Forbidden"], {
                message: "User not found",
            });
        }

        return {
            ...employee,
            user,
        };
    },

    async find({ businessId, userId }) {
        const employee = await db.query.employeesTable.findFirst({
            columns: {
                businessId: false,
                userId: false,
            },

            with: {
                user: {
                    columns: {
                        accountId: false,
                    },
                },
            },

            where: (t, { eq, and }) =>
                and(eq(t.userId, userId), eq(t.businessId, businessId)),
        });

        if (!employee) {
            throw new HTTPException(HTTP_STATUS["Not Found"], {
                message: "Employee not found",
            });
        }

        return employee;
    },

    async findAll({ businessId }) {
        const employees = await db.query.employeesTable.findMany({
            columns: {
                businessId: false,
                userId: false,
            },

            with: {
                user: {
                    columns: {
                        accountId: false,
                    },
                },
            },

            where: (t, { eq }) => eq(t.businessId, businessId),
        });

        return employees;
    },

    async update({ userId, businessId, ...input }) {
        const [[employee], user] = await db.batch([
            db
                .update(employeesTable)
                .set(input)
                .where(
                    and(
                        eq(employeesTable.userId, userId),
                        eq(employeesTable.businessId, businessId),
                    ),
                )
                .returning(
                    selectTableColumns(employeesTable, "omit", {
                        businessId: true,
                        userId: true,
                    }),
                ),
            db.query.usersTable.findFirst({
                columns: {
                    accountId: false,
                },
                where: (t, { eq }) => eq(t.id, userId),
            }),
        ]);

        if (!user) {
            throw new HTTPException(HTTP_STATUS["Forbidden"], {
                message: "User not found",
            });
        }

        return {
            ...employee,
            user,
        };
    },

    async delete({ userId, businessId }) {
        await db
            .delete(employeesTable)
            .where(
                and(
                    eq(employeesTable.userId, userId),
                    eq(employeesTable.businessId, businessId),
                ),
            );
    },
} satisfies ToFunctions<EmployeesServiceSchemaType>;
