"use client";

import { LocationSearch } from "@/features/business/components/location-search";
import { City } from "@/shared";
import { useGeolocation } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getSavedCity, saveCity } from "./search/save";

async function reverseGeocode(lat: number, lon: number): Promise<City | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
                `lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "YourAppName/1.0", // Required by Nominatim
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform Nominatim response to your City interface
        const city: City = {
            name: data.display_name || "",
            country: data.address?.country || "",
            state: data.address?.state,
            type: data.type || data.addresstype || "",
            postcode: data.address?.postcode || "",
            city:
                data.address?.city ||
                data.address?.town ||
                data.address?.village,
            county: data.address?.county,
            coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
        };

        return city;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
}

const LocationInput = ({ className }: { className?: string }) => {
    const state = useGeolocation({
        enableHighAccuracy: false,
        maximumAge: 100000,
    });
    const [currentCity, setCurrentCity] = useState<City | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        (async () => {
            const c = await getSavedCity();
            if (c) {
                setCurrentCity(c);
            }
        })();
    }, []);

    useEffect(() => {
        startTransition(async () => {
            if (
                !isPending &&
                !state.loading &&
                state.latitude &&
                state.longitude
            ) {
                if (!currentCity) {
                    const res = await reverseGeocode(
                        state.latitude,
                        state.longitude
                    );
                    if (res) {
                        setCurrentCity(res);

                        await saveCity(res);
                    }
                }
            }
        });
    }, [state]);

    return (
        <LocationSearch
            onChange={async (c) => {
                await saveCity(c);
                setCurrentCity(c);
            }}
            defaultSelectedValue={currentCity ?? undefined}
            label=""
            className={className}
            disabled={isPending}
            rightSection={
                isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                ) : undefined
            }
        />
    );
};

export default LocationInput;
