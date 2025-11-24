"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/shared/components/ui/command";
import { Input } from "@/shared/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import { IconBrandWhatsapp, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { searchBusiness } from "@/features/business/actions/search-business";
import { BusinessSchemaType } from "@/features/business/schema/business-schema";
import { cn } from "@/shared";
import { Button } from "@/shared/components/ui/button";
import { CardContent } from "@/shared/components/ui/card";
import { Spinner } from "@/shared/components/ui/spinner";
import Text from "@/shared/components/ui/text";
import contractorCategories from "@/shared/constants/contractors";
import { Command as CommandPrimitive } from "cmdk";
import { ArrowRight, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchInput = ({
    defaultValue = "",
    className,
}: {
    defaultValue?: string;
    className?: string;
}) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const [triggerWidth, setTriggerWidth] = useState(0);
    const [triggerHeight, setTriggerHeight] = useState(0);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [businesses, setBusinesses] = useState<BusinessSchemaType[]>([]);
    const [isLoadingBusinesses, startTransition] = useTransition();

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.clientWidth);
            setTriggerHeight(triggerRef.current.clientHeight);
        }
    }, [
        triggerRef.current,
        triggerRef.current?.clientWidth,
        triggerRef.current?.clientHeight,
    ]);

    useEffect(() => {
        const fetchBusinesses = () => {
            if (!value || value.length <= 2) {
                setBusinesses([]);
                return;
            }

            const ss = sessionStorage.getItem(`get-businesses-search-${value}`);

            if (ss) {
                const parsed = JSON.parse(ss) as BusinessSchemaType[];
                setBusinesses(parsed);
                return;
            }

            startTransition(async () => {
                try {
                    const result = await searchBusiness({
                        searchTerm: value,
                        limit: 3,
                    });
                    if (result.data) {
                        setBusinesses(result.data);
                        sessionStorage.setItem(
                            `get-businesses-search-${value}`,
                            JSON.stringify(result.data)
                        );
                    }
                } catch (error) {
                    console.error("Error fetching businesses:", error);
                    setBusinesses([]);
                }
            });
        };

        const debounceTimer = setTimeout(fetchBusinesses, 500);
        return () => clearTimeout(debounceTimer);
    }, [value]);

    const services = Object.entries(contractorCategories)
        .flatMap(([categoryName, category]) =>
            category.contractors
                .filter(
                    ({ name, description }) =>
                        name.toLowerCase().includes(value.toLowerCase()) ||
                        description.toLowerCase().includes(value.toLowerCase())
                )
                .map((contractor) => ({
                    ...contractor,
                    category: categoryName,
                    categoryColor: category.color,
                    categoryBgColor: category.bgColor,
                }))
        )
        .slice(0, 3);

    const router = useRouter();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    ref={triggerRef}
                    className={cn(
                        "relative flex-[0.6] cursor-text",
                        open && "opacity-0",
                        className
                    )}
                >
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for electricians, plumbers, carpenters..."
                        className="pl-9 h-12 font-medium text-base pointer-events-none"
                        defaultValue={defaultValue}
                        value={value}
                        onFocus={() => setOpen(true)}
                    />
                    {defaultValue !== value && (
                        <Button
                            className="absolute right-1 bottom-1"
                            variant="ghost"
                            size="icon-lg"
                            onClick={() => router.push(`/search/${value}`)}
                        >
                            <ArrowRight />
                        </Button>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent
                animate={false}
                autoFocus={false}
                sideOffset={-triggerHeight}
                style={{
                    width: triggerWidth,
                    maxWidth: triggerWidth,
                }}
                side="bottom"
                align="center"
                sticky="always"
                avoidCollisions={false}
                collisionPadding={0}
                className={cn(
                    "p-0 data-[state=closed]:fade-out-0 border-2",
                    !value && "shadow-none border-0"
                )}
            >
                <Command shouldFilter={false}>
                    <CommandPrimitive.Input
                        data-slot="command-input"
                        asChild
                        placeholder="Change status..."
                    >
                        <div className="relative flex-[0.6]">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for electricians, plumbers, carpenters..."
                                className={cn(
                                    "pl-9 h-12 font-medium text-base border-border! focus-visible:ring-0",
                                    value &&
                                        "shadow-none border-t-0 border-x-0 rounded-b-none"
                                )}
                                value={value}
                                defaultValue={defaultValue}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        router.push(`/search/${value}`);
                                    }
                                }}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            {defaultValue !== value && (
                                <Button
                                    className="absolute right-1 bottom-1.5"
                                    variant="ghost"
                                    size="icon-lg"
                                    onClick={() =>
                                        router.push(`/search/${value}`)
                                    }
                                >
                                    <ArrowRight />
                                </Button>
                            )}
                        </div>
                    </CommandPrimitive.Input>
                    {value && (
                        <CommandList className="mb-1">
                            <CommandEmpty>No results found.</CommandEmpty>
                            <div className="md:grid md:grid-cols-2">
                                <CommandGroup className="border-b sm:border-b-0 sm:border-r px-2">
                                    {(isLoadingBusinesses ||
                                        businesses.length > 0) && (
                                        <Text
                                            variant="muted"
                                            className="text-sm pt-1 pb-2 pl-1 font-medium"
                                        >
                                            Businesses
                                        </Text>
                                    )}
                                    {isLoadingBusinesses && (
                                        <div className="w-full h-20 flex items-center justify-center">
                                            <Spinner className="size-6" />
                                        </div>
                                    )}
                                    {!isLoadingBusinesses &&
                                        businesses.length === 0 && (
                                            <CommandItem
                                                disabled
                                                className="opacity-100!"
                                            >
                                                <Text
                                                    variant="muted"
                                                    className="text-sm"
                                                >
                                                    No businesses were found
                                                </Text>
                                            </CommandItem>
                                        )}
                                    {!isLoadingBusinesses &&
                                        businesses.map((business) => (
                                            <CommandItem
                                                key={business.id}
                                                value={business.id}
                                                className="cursor-pointer"
                                                onSelect={() => {
                                                    router.push(
                                                        `/b/${business.id}`
                                                    );
                                                }}
                                            >
                                                <div className="flex flex-row gap-3">
                                                    <div className="relative aspect-video size-20 shrink-0 overflow-hidden rounded-xl flex items-center justify-center">
                                                        <img
                                                            src={
                                                                business.thumbnail
                                                            }
                                                            alt={business.title}
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    </div>

                                                    <div className="flex flex-1 flex-col">
                                                        <div className="flex items-start">
                                                            <p className="font-semibold group-hover:underline text-sm">
                                                                {business.title}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                            <span>
                                                                {
                                                                    business
                                                                        .location
                                                                        .name
                                                                }
                                                                ,{" "}
                                                                {
                                                                    business
                                                                        .location
                                                                        .state
                                                                }{" "}
                                                            </span>
                                                        </div>

                                                        <div className="flex mt-2 flex-col sm:flex-row gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-2 h-7 text-xs border"
                                                                onClick={() =>
                                                                    console.log(
                                                                        "child"
                                                                    )
                                                                }
                                                            >
                                                                <Phone className="size-3 text-foreground" />
                                                                {
                                                                    business
                                                                        .professional
                                                                        .phoneNumbers
                                                                }
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-2 text-xs h-7 border"
                                                                onClick={() =>
                                                                    console.log(
                                                                        "child"
                                                                    )
                                                                }
                                                            >
                                                                <IconBrandWhatsapp className="size-4 text-teal-500" />
                                                                WhatsApp
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        ))}
                                </CommandGroup>

                                <CommandGroup className="border-t sm:border-t-0 sm:border-l px-2">
                                    {services.length > 0 && (
                                        <Text
                                            variant="muted"
                                            className="text-sm pt-1 pb-2 pl-1 font-medium"
                                        >
                                            Services
                                        </Text>
                                    )}
                                    {services.length === 0 && (
                                        <CommandItem
                                            disabled
                                            className="opacity-100!"
                                        >
                                            <Text
                                                variant="muted"
                                                className="text-sm"
                                            >
                                                No services were found
                                            </Text>
                                        </CommandItem>
                                    )}
                                    {services.map((contractor) => (
                                        <CommandItem
                                            key={contractor.name}
                                            className="w-full cursor-pointer p-0"
                                            onSelect={() => {
                                                router.push(
                                                    `/search/${contractor.name}`
                                                );
                                            }}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <span className="text-3xl">
                                                            {contractor.icon}
                                                        </span>
                                                        <div className="flex flex-col gap-0.5 flex-1">
                                                            <Text className="font-semibold">
                                                                {
                                                                    contractor.name
                                                                }
                                                            </Text>
                                                            <Text
                                                                variant="muted"
                                                                className="text-sm line-clamp-1"
                                                            >
                                                                {
                                                                    contractor.description
                                                                }
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </div>
                        </CommandList>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default SearchInput;
