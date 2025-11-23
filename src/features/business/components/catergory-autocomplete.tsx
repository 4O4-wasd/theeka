import contractorCategories from "@/shared/constants/contractors";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/components/ui/command";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Bolt, X } from "lucide-react";
import { useState } from "react";

export default function CategoryAutocomplete({
    categoryNames,
    setCategoryNames,
    error,
}: {
    error?: string;
    categoryNames: string[];
    setCategoryNames: (v: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const allContractorsFlat = Object.values(contractorCategories).flatMap(
        (category) => category.contractors.map((c) => c)
    );

    const allContractorsCategories = Object.keys(contractorCategories);

    const filteredData = Object.values(contractorCategories)
        .map((category, i) => ({
            group: allContractorsCategories[i],
            items: category.contractors
                .filter((c) =>
                    c.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((c) => c.name),
        }))
        .filter((group) => group.items.length > 0);

    const addCategory = (value: string) => {
        if (value.trim() && !categoryNames.includes(value.trim())) {
            setCategoryNames([value.trim(), ...categoryNames]);
        }
        setSearch("");
        setOpen(false);
    };

    const removeCategory = (category: string) => {
        setCategoryNames(categoryNames.filter((c) => c !== category));
    };

    return (
        <div className="space-y-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-auto py-3"
                    >
                        <div className="flex items-center gap-2">
                            <Bolt className="h-4 w-4 opacity-60" />
                            <span className="text-muted-foreground">
                                {search || "e.g., Electrician, Plumber, Mason"}
                            </span>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search services..."
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            <CommandEmpty>No service found.</CommandEmpty>
                            {filteredData.map((group) => (
                                <CommandGroup
                                    key={group.group}
                                    heading={group.group}
                                >
                                    {group.items.map((item) => {
                                        const contractor =
                                            allContractorsFlat.find(
                                                (c) => c.name === item
                                            )!;
                                        return (
                                            <CommandItem
                                                key={item}
                                                value={item}
                                                onSelect={() =>
                                                    addCategory(item)
                                                }
                                                className="cursor-pointer"
                                            >
                                                <span className="mr-3 text-xl">
                                                    {contractor.icon}
                                                </span>
                                                <div>
                                                    <div className="font-medium">
                                                        {item}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {contractor.description}
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {categoryNames.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {categoryNames.map((category) => {
                        const contractor = allContractorsFlat.find(
                            (c) => c.name === category
                        );

                        if (!contractor) return null;

                        return (
                            <Badge
                                key={category}
                                variant="secondary"
                                className="pl-3 pr-2 py-3 text-sm gap-3"
                            >
                                <span className="text-lg">
                                    {contractor.icon}
                                </span>
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">
                                        {category}
                                    </span>
                                    <span className="text-xs opacity-70">
                                        {contractor.description}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeCategory(category)}
                                    className="ml-2 rounded-full p-0.5 hover:bg-muted-foreground/20 transition"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
