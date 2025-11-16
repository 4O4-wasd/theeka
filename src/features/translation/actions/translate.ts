"use server";

import { translate as tt } from "@vitalets/google-translate-api";

export const translate = async (text: string, options: { to: string }) =>
    tt(text, {
        from: "en",
        to: options.to,
    });
