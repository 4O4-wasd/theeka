"use server";

import { unstable_cache } from "next/cache";

interface CityProperties {
    name: string;
    country: string;
    state?: string;
    type: string;
    postcode: string;
    city?: string;
    county?: string;
}

interface Feature {
    type: "Feature";
    properties: CityProperties;
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
}

interface PhotonResponse {
    type: "FeatureCollection";
    features: Feature[];
}

export interface City {
    name: string;
    country: string;
    state?: string;
    type: string;
    postcode?: string;
    city?: string;
    county?: string;
    coordinates: number[];
}

const fetchLocation = async (query: string): Promise<City[]> => {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query
    )}&limit=30&lang=en&location_bias_scale=0&bbox=68.7,6.7,97.2,35.5`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }

    const data: PhotonResponse = await response.json();

    const returnData: City[] = [];

    data.features
        .filter((feature) => feature.properties.country === "India")
        .forEach((feat) => {
            const doesExistAlready = !!returnData.find(
                (f) => f.name === feat.properties.name
            );
            if (doesExistAlready) {
                return;
            }
            returnData.push({
                name: feat.properties.name,
                country: feat.properties.country,
                state: feat.properties.state,
                coordinates: feat.geometry.coordinates,
                postcode: feat.properties.postcode,
                type: feat.properties.type,
                city: feat.properties.city,
                county: feat.properties.county,
            });
        });

    return returnData;
};

export async function searchLocations(city: string): Promise<City[]> {
    if (!city || typeof city !== "string") {
        return [];
    }

    try {
        const cities = await unstable_cache(
            () => fetchLocation(city),
            [`fetchLocation(${city})`],
            {
                tags: [`fetchLocation(${city})`],
            }
        )();
        return cities;
    } catch (error) {
        console.error("Error searching cities:", error);
        return [];
    }
}
