import type { ToFunctions } from "@/utils";
import { addressRepository } from "./address.repository";
import type { AddressServiceSchemaType } from "./address.schema";

export const addressService = {
    async findAll(input) {
        return await addressRepository.findAll(input);
    },

    async find(input) {
        return await addressRepository.find(input);
    },

    async create(input) {
        return await addressRepository.create(input);
    },

    async update(input) {
        return await addressRepository.update(input);
    },

    async delete(input) {
        await addressRepository.delete(input);
    },
} satisfies ToFunctions<AddressServiceSchemaType>;
