import db from "@/db";
import { userAddresses } from "@/db/schema";
import type { ToFunctions } from "@/utils";
import { and, eq } from "drizzle-orm";
import type { AddressRepositorySchemaType } from "./address.schema";

export const addressRepository = {
    async find(input) {
        const address = await db.query.userAddresses.findFirst({
            where: (t, { eq, and }) =>
                and(eq(t.id, input.id), eq(t.userId, input.userId)),
            columns: {
                userId: false,
            },
        });

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
            .returning({
                id: userAddresses.id,
                name: userAddresses.name,
                addressLine1: userAddresses.addressLine1,
                addressLine2: userAddresses.addressLine2,
                landmark: userAddresses.landmark,
                city: userAddresses.city,
                state: userAddresses.state,
                pincode: userAddresses.pincode,
                latitude: userAddresses.latitude,
                longitude: userAddresses.longitude,
            });
        return address;
    },

    async update({ userId, id, ...input }) {
        const [address] = await db
            .update(userAddresses)
            .set(input)
            .where(
                and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)),
            )
            .returning();

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
} satisfies ToFunctions<AddressRepositorySchemaType>;
