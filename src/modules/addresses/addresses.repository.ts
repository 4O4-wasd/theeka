import db from "@/db";
import { userAddresses } from "@/db/schema";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { AddressesRepositorySchemaType } from "./addresses.schema";

export const addressesRepository = {
    async find(input) {
        const address = await db.query.userAddresses.findFirst({
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
        const addresses = await db.query.userAddresses.findMany({
            where: (t, { eq }) => eq(t.userId, input.userId),
            columns: {
                userId: false,
            },
        });

        return addresses;
    },

    async create(input) {
        const [address] = await db
            .insert(userAddresses)
            .values(input)
            .returning(
                selectTableColumns(userAddresses, "omit", {
                    userId: true,
                }),
            );

        return address;
    },

    async update({ userId, id, ...input }) {
        const [address] = await db
            .update(userAddresses)
            .set(input)
            .where(
                and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)),
            )
            .returning(
                selectTableColumns(userAddresses, "omit", {
                    userId: true,
                }),
            );

        return address;
    },

    async delete(input) {
        await db
            .delete(userAddresses)
            .where(
                and(
                    eq(userAddresses.id, input.id),
                    eq(userAddresses.userId, input.userId),
                ),
            );
    },
} satisfies ToFunctions<AddressesRepositorySchemaType>;
