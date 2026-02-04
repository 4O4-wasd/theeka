import type { ToFunctions } from "@/utils/types";
import { addressesRepository } from "./addresses.repository";
import type { AddressesServiceSchemaType } from "./addresses.schema";

export const addressesService = {
    async findAll(input) {
        return await addressesRepository.findAll(input);
    },

    async find(input) {
        return await addressesRepository.find(input);
    },

    async create(input) {
        return await addressesRepository.create(input);
    },

    async update(input) {
        return await addressesRepository.update(input);
    },

    async delete(input) {
        await addressesRepository.delete(input);
    },
} satisfies ToFunctions<AddressesServiceSchemaType>;
