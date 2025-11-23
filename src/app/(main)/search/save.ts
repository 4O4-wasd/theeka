"use server";

import { City } from "@/shared";
import { cookies } from "next/headers";
import { cache } from "react";

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

export const getSavedCity = cache(async () => {
    const cookieStore = await cookies();
    console.log("city")
    const city = cookieStore.get("current-city");
    if (city && city.value) {
        return JSON.parse(city.value) as City;
    }
});
