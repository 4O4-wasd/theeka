"use server"

import { auth } from "@/features/auth/utils/auth";
import { headers } from "next/headers";

export const a = async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
}