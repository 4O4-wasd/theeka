import db from "@/db";
import { userAddresses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { AddressRepositorySchemaType } from "./address.schema";

export const addressRepository = {
    async find(
        input: AddressRepositorySchemaType["find"]["input"],
    ): Promise<AddressRepositorySchemaType["find"]["output"]> {
        const address = await db.query.userAddresses.findFirst({
            where: (t, { eq, and }) =>
                and(eq(t.id, input.id), eq(t.userId, input.userId)),
            columns: {
                userId: false,
            },
        });

        return address;
    },

    async findAll(
        input: AddressRepositorySchemaType["findAll"]["input"],
    ): Promise<AddressRepositorySchemaType["findAll"]["output"]> {
        const addresses = await db.query.userAddresses.findMany({
            where: (t, { eq }) => eq(t.userId, input.userId),
            columns: {
                userId: false,
            },
        });

        return addresses;
    },

    async create(
        input: AddressRepositorySchemaType["create"]["input"],
    ): Promise<AddressRepositorySchemaType["create"]["output"]> {
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

    async update({
        userId,
        id,
        ...input
    }: AddressRepositorySchemaType["update"]["input"]): Promise<
        AddressRepositorySchemaType["update"]["output"]
    > {
        const [address] = await db
            .update(userAddresses)
            .set(input)
            .where(
                and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)),
            )
            .returning();

        return address;
    },
};
