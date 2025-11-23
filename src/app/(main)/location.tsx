"use client";

import { LocationSearch } from "@/features/business/components/location-search";
import { City, cn } from "@/shared";
import { Button } from "@/shared/components/ui/button";
import { useGeolocation } from "@uidotdev/usehooks";
import { MapPin } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getSavedCity, saveCity } from "./search/save";

async function reverseGeocode(lat: number, lon: number): Promise<City | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
                `lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "Theeka/1.0",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const city: City = {
            name: data.display_name || "",
            country: "",
            state: "",
            type: "",
            postcode: "",
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

    const geoLocation = (isUseEffect: boolean = false) => {
        startTransition(async () => {
            if (
                !isPending &&
                !state.loading &&
                state.latitude &&
                state.longitude
            ) {
                if (currentCity && isUseEffect) {
                    return;
                }
                const res = await reverseGeocode(
                    state.latitude,
                    state.longitude
                );
                if (res) {
                    setCurrentCity(res);
                    await saveCity(res);
                }
            } else if (!isUseEffect) {
                toast.error("Please enable Location");
            }
        });
    };

    useEffect(() => {
        geoLocation(true);
    }, [state]);

    return (
        <div className={cn("flex", className)}>
            <LocationSearch
                onChange={async (c) => {
                    await saveCity(c);
                    setCurrentCity(c);
                }}
                defaultSelectedValue={currentCity ?? undefined}
                label=""
                className="flex-1"
                buttonClassName="rounded-r-none border-r"
                disabled={isPending}
            />
            <Button
                variant="outline"
                size="icon"
                className="rounded-l-none border-l"
                onClick={() => geoLocation()}
            >
                <MapPin className="size-4" />
            </Button>
        </div>
    );
};

export default LocationInput;
