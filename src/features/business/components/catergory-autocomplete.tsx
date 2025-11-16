import contractorCategories from "@/shared/constants/contractors";
import {
    ActionIcon,
    Autocomplete,
    AutocompleteProps,
    Group,
    Paper,
    Text,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconBolt, IconX } from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";

export default function CategoryAutocomplete({
    categoryNames,
    setCategoryNames,
    error,
}: {
    error?: ReactNode;
    categoryNames: string[];
    setCategoryNames: (v: string[]) => void;
}) {
    const [currentCategory, setCurrentCategory] = useState("");
    const [clear, setClear] = useState(false);

    const { height } = useViewportSize();

    const allContractorsFlat = Object.values(contractorCategories).flatMap(
        (category) => category.contractors.map((c) => c)
    );

    const allContractorsCategories = Object.keys(contractorCategories);

    const allContractorsData = Object.values(contractorCategories).map(
        (category, i) => ({
            group: allContractorsCategories[i],
            items: category.contractors.map((c) => c.name),
        })
    );

    const addCategory = (value: string): void => {
        if (value.trim() && !categoryNames.includes(value.trim())) {
            setCategoryNames([value.trim(), ...categoryNames]);
            setCurrentCategory("");
        }
    };

    const removeCategory = (category: string): void => {
        setCategoryNames(categoryNames.filter((c) => c !== category));
    };

    const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({
        option,
    }) => {
        const contractor = allContractorsFlat.find(
            (c) => c.name === option.value
        );

        if (!contractor) {
            return null;
        }

        return (
            <Group gap="md" p={4}>
                <Text size="xl">{contractor.icon}</Text>
                <div>
                    <Text size="sm">{option.value}</Text>
                    <Text size="xs" opacity={0.5}>
                        {contractor.description}
                    </Text>
                </div>
            </Group>
        );
    };

    useEffect(() => {
        if (clear) {
            setCurrentCategory("");
            const t = setTimeout(() => {
                setClear(false);
            }, 2);

            return () => {
                clearTimeout(t);
            };
        }
    }, [clear]);

    return (
        <div>
            <Autocomplete
                placeholder="e.g., Electrician, Plumber, Mason"
                label="Services that you provide"
                value={currentCategory}
                onChange={(v) => {
                    if (!clear) {
                        setCurrentCategory(v);
                    }
                }}
                onOptionSubmit={(value) => {
                    addCategory(value);
                    setClear(true);
                }}
                maxDropdownHeight={height * 0.5}
                renderOption={renderAutocompleteOption}
                data={allContractorsData}
                rightSection={<IconBolt size={16} />}
                error={error}
                comboboxProps={{
                    shadow: "md",
                    transitionProps: {
                        transition: "scale-y",
                        duration: 250,
                    },
                }}
            />
            {categoryNames.length > 0 && (
                <Group gap="xs" mt="md">
                    {categoryNames.map((category, index) => {
                        const contractor = allContractorsFlat.find(
                            (c) => c.name === category
                        );

                        if (!contractor) {
                            return null;
                        }

                        return (
                            <Paper
                                withBorder
                                className="w-full"
                                p={12}
                                key={index}
                            >
                                <Group gap="md" className="w-full">
                                    <Text size="xl" pl={2}>
                                        {contractor.icon}
                                    </Text>
                                    <div className="flex-1">
                                        <Text size="sm">{category}</Text>
                                        <Text size="xs" opacity={0.5}>
                                            {contractor.description}
                                        </Text>
                                    </div>
                                    <ActionIcon
                                        color="gray"
                                        variant="default"
                                        onClick={() => removeCategory(category)}
                                        className="ml-auto"
                                        size="md"
                                    >
                                        <IconX size={16} />
                                    </ActionIcon>
                                </Group>
                            </Paper>
                        );
                    })}
                </Group>
            )}
        </div>
    );
}
