import db from "@/db";
import { userAddresses, type UserAddressSchemaType } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type {
    CreateAddressInputSchemaType,
    CreateAddressSchemaType,
    FindAddressResponseSchemaType,
    UpdateAddressOutputSchemaType,
    UpdateAddressSchemaType,
} from "./address.schema";

export class AddressRepository {
    async find(
        id: string,
        userId: string
    ): Promise<FindAddressResponseSchemaType | undefined> {
        const address = await db.query.userAddresses.findFirst({
            where: (t, { eq, and }) => and(eq(t.id, id), eq(t.userId, userId)),
        });

        return address;
    }

    async findAll(userId: string): Promise<UserAddressSchemaType[]> {
        const addresses = await db.query.userAddresses.findMany({
            where: (t, { eq }) => eq(t.userId, userId),
        });

        return addresses;
    }

    async create(
        data: CreateAddressSchemaType
    ): Promise<CreateAddressInputSchemaType> {
        const [address] = await db
            .insert(userAddresses)
            .values(data)
            .returning();
        return address;
    }

    async update({
        id,
        userId,
        ...data
    }: UpdateAddressSchemaType): Promise<UpdateAddressOutputSchemaType> {
        const [address] = await db
            .update(userAddresses)
            .set({
                ...data,
            })
            .where(
                and(eq(userAddresses.id, id), eq(userAddresses.userId, userId))
            )
            .returning();

        return address;
    }
}
