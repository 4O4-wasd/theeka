"use client";

import { City, searchLocations } from "@/shared/actions/search-location";
import { Autocomplete, AutocompleteProps, Text } from "@mantine/core";
import { MapPin } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

export function LocationSearch({
    onChange,
    label = "Location",
    description,
    placeholder = "Search address...",
    className,
    defaultSelectedValue,
    rightSection,
    disabled,
}: {
    onChange: (data: City) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    description?: string;
    defaultSelectedValue?: City;
    rightSection?: ReactNode;
    disabled?: boolean;
}) {
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useRef<NodeJS.Timeout | null>(null);
    const [currentSelectedSuggestion, setCurrentSelectedSuggestion] =
        useState<City | null>(defaultSelectedValue ?? null);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (defaultSelectedValue) {
            setCurrentSelectedSuggestion(defaultSelectedValue ?? null);
            setValue(getDisplayAddress(defaultSelectedValue));
        }
    }, [defaultSelectedValue]);

    const getDisplayAddress = (properties: City): string => {
        const parts: string[] = [properties.name];
        if (properties.city) parts.push(properties.city);
        else if (properties.county && properties.county !== properties.name)
            parts.push(properties.county);
        if (properties.state && !parts.includes(properties.state))
            parts.push(properties.state);
        if (properties.postcode)
            parts[parts.length - 1] += ` ${properties.postcode}`;
        parts.push(properties.country);
        return parts.join(", ");
    };

    const handleInputChange = (inputValue: string) => {
        setValue(inputValue);
        if (debouncedSearch.current) clearTimeout(debouncedSearch.current);

        if (inputValue.length < 2) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        debouncedSearch.current = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await searchLocations(inputValue);
                setSuggestions(data || []);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSelect = (selectedValue: string) => {
        const suggestion = suggestions.find(
            (s) => getDisplayAddress(s) === selectedValue
        );

        if (suggestion) {
            setCurrentSelectedSuggestion(suggestion);
            onChange(suggestion);
        }
    };

    const renderOption: AutocompleteProps["renderOption"] = ({ option }) => {
        const suggestion = suggestions.find(
            (s) => getDisplayAddress(s) === option.value
        );

        if (!suggestion) return null;

        return (
            <div className="p-1">
                <Text size="sm" fw={500}>
                    {suggestion.name}
                </Text>
                <Text size="xs">{getDisplayAddress(suggestion)}</Text>
            </div>
        );
    };

    useEffect(() => {
        return () => {
            if (debouncedSearch.current) clearTimeout(debouncedSearch.current);
        };
    }, []);

    const autocompleteData = [
        ...new Set(suggestions.map((s) => getDisplayAddress(s))),
    ];

    const address =
        currentSelectedSuggestion &&
        getDisplayAddress(currentSelectedSuggestion);

    return (
        <div className={className}>
            <Autocomplete
                label={label}
                placeholder={placeholder}
                onChange={handleInputChange}
                onOptionSubmit={handleSelect}
                data={autocompleteData}
                renderOption={renderOption}
                maxDropdownHeight={300}
                description={description}
                disabled={disabled}
                rightSection={rightSection ?? <MapPin size={16} />}
                value={value}
                comboboxProps={{
                    shadow: "md",
                    transitionProps: {
                        transition: "scale-y",
                        duration: 250,
                    },
                    position: "bottom",
                }}
            />
            {address && currentSelectedSuggestion?.coordinates && (
                <Text size="xs" c="dimmed" mt="xs">
                    Set to: {address} (
                    {currentSelectedSuggestion.coordinates[1]},{" "}
                    {currentSelectedSuggestion.coordinates[0]})
                </Text>
            )}
        </div>
    );
}
