"use server";

import { auth } from "@/features/auth/utils/auth";
import { actionClient } from "@/shared/action-clients";
import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";
import z from "zod";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const cloudinarySign = actionClient
    .inputSchema(
        z.object({
            paramsToSign: z.record(
                z.string(),
                z.union([z.string(), z.number()])
            ),
        })
    )
    .action(async ({ parsedInput: { paramsToSign } }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            throw new Error("You are not logged in");
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        return signature;
    });
