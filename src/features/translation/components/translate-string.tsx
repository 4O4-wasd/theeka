"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../providers/language-provider";

const TS = ({
    string,
    children,
}: {
    string: string;
    children: (translatedString: string) => React.ReactNode;
}) => {
    const [tString, setTString] = useState(string);
    const { language, translate } = useLanguage();

    useEffect(() => {
        (async () => {
            const tt = await translate(string);
            setTString(tt);
        })();
    }, [string, language]);
    return children(tString);
};

export { TS };
