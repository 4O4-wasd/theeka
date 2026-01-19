import { addressRepository } from "./address.repository";
import type { AddressServiceSchemaType } from "./address.schema";

export const addressService = {
    async findAll(
        input: AddressServiceSchemaType["findAll"]["input"],
    ): Promise<AddressServiceSchemaType["findAll"]["output"]> {
        return await addressRepository.findAll(input);
    },

    async find(
        input: AddressServiceSchemaType["find"]["input"],
    ): Promise<AddressServiceSchemaType["find"]["output"]> {
        return await addressRepository.find(input);
    },

    async create(
        input: AddressServiceSchemaType["create"]["input"],
    ): Promise<AddressServiceSchemaType["create"]["output"]> {
        return await addressRepository.create(input);
    },

    async update(
        input: AddressServiceSchemaType["update"]["input"],
    ): Promise<AddressServiceSchemaType["update"]["output"]> {
        return await addressRepository.update(input);
    },
};
