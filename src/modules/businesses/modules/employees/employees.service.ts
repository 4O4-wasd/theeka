import type { ToFunctions } from "@/utils/types";
import type { EmployeesServiceSchemaType } from "./employees.schema";

export const employeesService = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<EmployeesServiceSchemaType>;
