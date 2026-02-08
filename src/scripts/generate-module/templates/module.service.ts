import type { ToFunctions } from "@/utils/types";
import type { ModuleServiceSchemaType } from "./module.schema";

export const moduleService = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<ModuleServiceSchemaType>;
