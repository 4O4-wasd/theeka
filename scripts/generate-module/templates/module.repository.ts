import type { ToFunctions } from "@/utils/types";
import type { ModuleRepositorySchemaType } from "./module.schema";

export const moduleRepository = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<ModuleRepositorySchemaType>;
