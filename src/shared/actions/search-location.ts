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

    return data.features
        .filter((feature) => feature.properties.country === "India")
        .map(
            (feature): City => ({
                name: feature.properties.name,
                country: feature.properties.country,
                state: feature.properties.state,
                coordinates: feature.geometry.coordinates,
                postcode: feature.properties.postcode,
                type: feature.properties.type,
                city: feature.properties.city,
                county: feature.properties.county,
            })
        );
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
