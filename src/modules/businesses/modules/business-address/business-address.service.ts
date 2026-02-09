import db from "@/db";
import { businessAddressesTable } from "@/db/tables";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { BusinessAddressServiceSchemaType } from "./business-address.schema";

export const businessAddressService = {
    async find(input) {
        const address = await db.query.businessAddressesTable.findFirst({
            where: (t, { eq, and }) => eq(t.businessId, input.businessId),
            columns: {
                businessId: false,
            },
        });

        if (!address) {
            throw new HTTPException(HTTP_STATUS["Not Found"], {
                message: "Address not found",
            });
        }

        return address;
    },

    async create(input) {
        const [address] = await db
            .insert(businessAddressesTable)
            .values(input)
            .returning(
                selectTableColumns(businessAddressesTable, "omit", {
                    businessId: true,
                }),
            );

        return address;
    },

    async update(input) {
        const [address] = await db
            .update(businessAddressesTable)
            .set(input)
            .where(eq(businessAddressesTable.businessId, input.businessId))
            .returning(
                selectTableColumns(businessAddressesTable, "omit", {
                    businessId: true,
                }),
            );

        return address;
    },

    async delete(input) {
        await db
            .delete(businessAddressesTable)
            .where(eq(businessAddressesTable.businessId, input.businessId));
    },
} satisfies ToFunctions<BusinessAddressServiceSchemaType>;
