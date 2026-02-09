import db from "@/db";
import { userAddressesTable } from "@/db/tables";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { AddressesServiceSchemaType } from "./addresses.schema";

export const addressesService = {
    async find(input) {
        const address = await db.query.userAddressesTable.findFirst({
            where: (t, { eq, and }) =>
                and(eq(t.id, input.id), eq(t.userId, input.userId)),
            columns: {
                userId: false,
            },
        });

        if (!address) {
            throw new HTTPException(HTTP_STATUS["Not Found"], {
                message: "Address not found",
            });
        }

        return address;
    },

    async findAll(input) {
        const addresses = await db.query.userAddressesTable.findMany({
            where: (t, { eq }) => eq(t.userId, input.userId),
            columns: {
                userId: false,
            },
        });

        return addresses;
    },

    async create(input) {
        const [address] = await db
            .insert(userAddressesTable)
            .values(input)
            .returning(
                selectTableColumns(userAddressesTable, "omit", {
                    userId: true,
                }),
            );

        return address;
    },

    async update({ userId, id, ...input }) {
        const [address] = await db
            .update(userAddressesTable)
            .set(input)
            .where(
                and(
                    eq(userAddressesTable.id, id),
                    eq(userAddressesTable.userId, userId),
                ),
            )
            .returning(
                selectTableColumns(userAddressesTable, "omit", {
                    userId: true,
                }),
            );

        return address;
    },

    async delete(input) {
        await db
            .delete(userAddressesTable)
            .where(
                and(
                    eq(userAddressesTable.id, input.id),
                    eq(userAddressesTable.userId, input.userId),
                ),
            );
    },
} satisfies ToFunctions<AddressesServiceSchemaType>;
