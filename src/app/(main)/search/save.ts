"use server";

import { City } from "@/shared";
import { cookies } from "next/headers";

export const saveCity = async (city: City) => {
    const cookieStore = await cookies();
    cookieStore.set("current-city", JSON.stringify(city), {
        sameSite: "strict",
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 100 * 60 * 60 * 60 * 24 * 30 * 12,
    });
    console.log("done");
};

export const getSavedCity = async () => {
    const cookieStore = await cookies();
    const city = cookieStore.get("current-city");
    if (city && city.value) {
        return JSON.parse(city.value) as City;
    }
};
