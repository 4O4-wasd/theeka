"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

function Map({
    lat,
    lng,
    name,
    serviceRadius,
}: {
    lat: number;
    lng: number;
    name: string;
    serviceRadius: string | number;
}) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!mapRef.current || mapInstanceRef.current) return;

        const getZoom = (radiusKm: number): number => {
            const earthCircumference = 40075017;
            const radiusMeters = radiusKm * 1000;
            const desiredMeters = radiusMeters * 2 * 1.5;
            const mapWidthPixels = 500;
            const metersPerPixel = desiredMeters / mapWidthPixels;
            const zoom = Math.log2(earthCircumference / (metersPerPixel * 256));
            return Math.max(5, Math.min(18, Math.round(zoom)));
        };

        const radius = parseFloat(serviceRadius.toString());

        const map = L.map(mapRef.current, {
            center: [lat, lng],
            zoom: getZoom(radius),
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
            map
        );

        const circle = L.circle([lat, lng], {
            radius: radius * 1000,
            color: "#3b82f6",
            fillColor: "transparent",
            fillOpacity: 0,
            weight: 4,
            interactive: false,
        }).addTo(map);

        const icon = L.icon({
            iconUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl:
                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            shadowSize: [41, 41],
        });

        const labelIcon = L.divIcon({
            className: "map-label",
            html: /*html*/ `<div style="
            font-size: 15px;
            font-weight: 600;
            color: #333;
            font-family: '__nextjs-Geist';
            ">${name}</div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 12], // Position above the marker
        });

        L.marker([lat, lng], { icon: labelIcon }).addTo(map);

        L.marker([lat, lng], { icon }).addTo(map);

        const bounds = circle.getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [lat, lng, serviceRadius, name]);

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

export { Map };
