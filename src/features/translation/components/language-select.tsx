"use client";

import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { languages } from "../constants/languages";
import { useLanguage } from "../providers/language-provider";
import { TT } from "./translate-text";

const LanguageSelect = () => {
    const { setLanguage, language } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 z-101">
                {Object.keys(languages).map((key) => (
                    <DropdownMenuCheckboxItem
                        checked={key === language}
                        onCheckedChange={() =>
                            setLanguage(key as keyof typeof languages)
                        }
                        key={key}
                        className="font-medium"
                    >
                        <TT to={key as keyof typeof languages}>
                            {languages[key as keyof typeof languages]}
                        </TT>
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { LanguageSelect };
