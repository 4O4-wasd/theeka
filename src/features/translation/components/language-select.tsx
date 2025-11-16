"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { Languages } from "lucide-react";
import { languages } from "../constants/languages";
import { useLanguage } from "../providers/language-provider";

const LanguageSelect = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon variant="default" size="lg">
                    <Languages size={20} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <div className="h-[50vh] overflow-auto">
                    {Object.keys(languages).map((key) => (
                        <Menu.Item
                            onClick={() =>
                                setLanguage(key as keyof typeof languages)
                            }
                            key={key}
                        >
                            {languages[key as keyof typeof languages]}
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Dropdown>
        </Menu>
    );
};

export { LanguageSelect };

