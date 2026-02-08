import type { ToFunctions } from "@/utils/types";
import type { BusinessAddressServiceSchemaType } from "./business-address.schema";

export const businessAddressService = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<BusinessAddressServiceSchemaType>;
