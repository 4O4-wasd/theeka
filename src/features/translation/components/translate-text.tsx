"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../providers/language-provider";

const TT = ({ children }: { children: string }) => {
    const [tText, setTText] = useState(children);
    const { language, translate } = useLanguage();

    useEffect(() => {
        (async () => {
            const tt = await translate(children);
            setTText(tt);
        })();
    }, [children, language]);
    return tText;
};

export {TT};
