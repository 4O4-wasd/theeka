import type { ToFunctions } from "@/utils/types";
import type { BusinessAddressRepositorySchemaType } from "./business-address.schema";

export const businessAddressRepository = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<BusinessAddressRepositorySchemaType>;
