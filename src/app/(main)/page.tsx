"use client";

import SearchInput from "@/features/explore/components/search-input";
import { TT } from "@/features/translation";
import { cn } from "@/shared";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import Text, { textVariants } from "@/shared/components/ui/text";
import contractorCategories from "@/shared/constants/contractors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import LocationInput from "./location";

export default function ContractorExploreContent() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const allContractors = Object.entries(contractorCategories).flatMap(
        ([categoryName, category]) =>
            category.contractors.map((contractor) => ({
                ...contractor,
                category: categoryName,
                categoryColor: category.color,
                categoryBgColor: category.bgColor,
            }))
    );

    const filteredContractors = selectedCategory
        ? allContractors.filter((c) => c.category === selectedCategory)
        : allContractors;

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();

    return (
        <>
            <div>
                <div className="container max-w-7xl py-12 px-4">
                    <div className="flex flex-col gap-4 mb-6">
                        <Text variant="h1">Search for the Right Business</Text>
                    </div>

                    <div className="flex gap-2 shrink-0 flex-col">
                        <SearchInput />
                        <LocationInput className="!flex-[0.4]" />
                    </div>
                </div>
            </div>

            <div className="container max-w-7xl px-4">
                <div className="flex items-center justify-between mb-5">
                    <Text variant="h2">Browse by Category</Text>
                    {selectedCategory && (
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedCategory(null)}
                        >
                            Clear filter
                        </Button>
                    )}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {Object.entries(contractorCategories).map(
                        ([categoryName, category]) => {
                            const Icon = category.icon;
                            const isSelected =
                                selectedCategory === categoryName;
                            return (
                                <Button
                                    key={categoryName}
                                    className={cn(
                                        "rounded-xl h-auto flex justify-start items-center gap-3.5 p-2"
                                    )}
                                    variant={
                                        isSelected ? "secondary" : "outline"
                                    }
                                    onClick={() => {
                                        if (isSelected) {
                                            setSelectedCategory(null);
                                            return;
                                        }
                                        setSelectedCategory(categoryName);
                                        scrollRef.current?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                    }}
                                >
                                    <div className="flex size-13 border-2 rounded-full items-center justify-center shrink-0">
                                        <Icon className="text-foreground size-5" />
                                    </div>
                                    <div className="flex flex-col gap-1 items-start justify-center mb-2">
                                        <Text className="font-semibold mt-1.5 line-clamp-2">
                                            {categoryName}
                                        </Text>
                                        <p
                                            className={cn(
                                                textVariants({
                                                    variant: "muted",
                                                }),
                                                "text-xs"
                                            )}
                                        >
                                            {category.contractors.length}{" "}
                                            {category.contractors.length ===
                                            1 ? (
                                                <TT>service</TT>
                                            ) : (
                                                <TT>services</TT>
                                            )}
                                        </p>
                                    </div>
                                </Button>
                            );
                        }
                    )}
                </div>
                <div className="flex flex-col gap-12 pb-48" ref={scrollRef}>
                    <div className="flex justify-center sm:items-center sm:justify-between flex-col sm:flex-row">
                        <Text variant="h2">
                            {selectedCategory
                                ? selectedCategory
                                : "All Services"}
                        </Text>
                        <Text variant="muted">
                            {filteredContractors.length} services available
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContractors.map((contractor, idx) => (
                            <Link
                                key={idx}
                                prefetch={false}
                                href={`/search/${contractor.name}`}
                                className="rounded-xl transition-all"
                            >
                                <Card className="h-full cursor-pointer p-0">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">
                                                    {contractor.icon}
                                                </span>
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <Text className="font-semibold">
                                                        {contractor.name}
                                                    </Text>
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-fit"
                                                    >
                                                        <Text>
                                                            {
                                                                contractor.category
                                                            }
                                                        </Text>
                                                    </Badge>
                                                    <Text
                                                        variant="muted"
                                                        className="text-sm"
                                                    >
                                                        {contractor.description}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {filteredContractors.length === 0 && (
                        <div className="flex flex-col items-center py-16">
                            <span className="text-6xl">🔍</span>
                            <h3 className="text-2xl font-bold mt-4">
                                No contractors found
                            </h3>
                            <p className="text-muted-foreground mt-2">
                                Try adjusting your search or browse all
                                categories
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
