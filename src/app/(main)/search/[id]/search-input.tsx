"use client";

import { ActionIcon, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchInput = ({ defaultValue }: { defaultValue: string }) => {
    const router = useRouter();
    const [value, setValue] = useState(defaultValue);

    const action = () => {
        router.push(`/search/${value}`);
    };

    return (
        <TextInput
            placeholder="Search"
            value={value}
            onChange={(v) => setValue(v.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    action();
                }
            }}
            rightSection={
                <ActionIcon variant="default" size="lg" onClick={action}>
                    <Search size={16} />
                </ActionIcon>
            }
        />
    );
};

export default SearchInput;
