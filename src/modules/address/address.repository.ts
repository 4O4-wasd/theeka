import db from "@/db";
import { userAddresses, type UserAddressSchemaType } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type {
    CreateAddressSchemaType,
    UpdateAddressSchemaType,
} from "./address.schema";

export class AddressRepository {
    async findById(
        id: string,
        userId: string
    ): Promise<UserAddressSchemaType | undefined> {
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
    ): Promise<UserAddressSchemaType> {
        const id = crypto.randomUUID();
        await db.insert(userAddresses).values({ id, ...data });
        return { id, ...data };
    }

    async update(
        id: string,
        userId: string,
        data: UpdateAddressSchemaType
    ): Promise<UserAddressSchemaType> {
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
