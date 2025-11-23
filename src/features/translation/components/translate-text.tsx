"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../providers/language-provider";
import { LanguageType } from "../constants/languages";

const TT = ({ children, to }: { children: string; to?: LanguageType }) => {
    const [tText, setTText] = useState(children);
    const { language, translate } = useLanguage();

    useEffect(() => {
        (async () => {
            const tt = await translate(children, to);
            setTText(tt);
        })();
    }, [children, language]);
    return tText;
};

export {TT};
