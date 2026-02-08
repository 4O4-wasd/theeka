import type { ToFunctions } from "@/utils/types";
import { businessAddressRepository } from "./business-address.repository";
import type { BusinessAddressServiceSchemaType } from "./business-address.schema";

export const businessAddressService = {
    async findAll(input) {
        return await businessAddressRepository.findAll(input);
    },
} satisfies ToFunctions<BusinessAddressServiceSchemaType>;
