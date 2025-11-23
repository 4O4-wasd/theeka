"use client";

import { cn } from "@/shared";
import { City, searchLocations } from "@/shared/actions/search-location";
import { Button } from "@/shared/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/components/ui/command";
import { Label } from "@/shared/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Spinner } from "@/shared/components/ui/spinner";
import { ReactNode, useEffect, useId, useRef, useState } from "react";

export function LocationSearch({
    onChange,
    label = "Location",
    description,
    placeholder = "Search address...",
    className,
    buttonClassName,
    defaultSelectedValue,
    rightSection,
    disabled,
}: {
    onChange: (data: City) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    buttonClassName?: string;
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
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (defaultSelectedValue) {
            setCurrentSelectedSuggestion(defaultSelectedValue ?? null);
        }
    }, [defaultSelectedValue]);

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.clientWidth);
        }
    }, [value, loading, triggerRef.current, triggerRef.current?.clientWidth]);

    const getDisplayAddress = (properties: City) => {
        const parts: string[] = [properties.name];
        if (properties.city) parts.push(properties.city);
        else if (properties.county && properties.county !== properties.name)
            parts.push(properties.county);
        if (properties.state && !parts.includes(properties.state))
            parts.push(properties.state);
        if (properties.postcode)
            parts[parts.length - 1] += ` ${properties.postcode}`;
        parts.push(properties.country);
        const setParts = [...(new Set(([...new Set(parts)].join(", ")).split(", ")))];
        console.log(setParts);
        return setParts.join(", ").replace(/,(?=[^,]*$)/, "");
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
            setValue(selectedValue);
            onChange(suggestion);
            setOpen(false);
        }
    };

    useEffect(() => {
        return () => {
            if (debouncedSearch.current) clearTimeout(debouncedSearch.current);
        };
    }, []);

    const address =
        currentSelectedSuggestion &&
        getDisplayAddress(currentSelectedSuggestion);

    const id = useId();

    return (
        <div className={cn(className)}>
            <Label htmlFor={id}>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        className={cn(
                            "w-full justify-start bg-background! active:border-ring active:ring-ring/50 active:ring-[3px] font-normal overflow-hidden text-clip",
                            !address && "text-muted-foreground!",
                            buttonClassName
                        )}
                        variant="outline"
                        id={id}
                    >
                        {address ?? placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" style={{ width: triggerWidth }}>
                    <Command shouldFilter={false} loop>
                        <CommandInput
                            placeholder={placeholder}
                            className="h-9"
                            disabled={disabled}
                            value={value}
                            onValueChange={handleInputChange}
                        />
                        <CommandList>
                            {loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty>
                                        No results found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {suggestions.map(
                                            (suggestion, index) => {
                                                const display =
                                                    getDisplayAddress(
                                                        suggestion
                                                    );
                                                return (
                                                    <CommandItem
                                                        key={index}
                                                        onSelect={() =>
                                                            handleSelect(
                                                                display
                                                            )
                                                        }
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    suggestion.name
                                                                }
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {display}
                                                            </span>
                                                        </div>
                                                    </CommandItem>
                                                );
                                            }
                                        )}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {description && (
                <p className="text-sm text-muted-foreground mt-1">
                    {description}
                </p>
            )}
        </div>
    );
}
