"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { translate as tt } from "../actions/translate";
import { LanguageType } from "../constants/languages";

type LanguageContextType = {
    language: LanguageType | null;
    loading: boolean;
    translate: (text: string, to?: LanguageType) => Promise<string>;
    setLanguage: (language: LanguageType) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

const generateTranslateCacheKey = (
    text: string,
    from: LanguageType,
    to: LanguageType
) => {
    return `@translation_cache:${from}:${to}:${text}`;
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
};

const LANGUAGE_STORAGE_KEY = "language";

const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<LanguageType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const setLanguage = async (newLanguage: LanguageType) => {
        const prev = language;
        try {
            setLanguageState(newLanguage);
            localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
        } catch (error) {
            setLanguageState(prev);
            console.error("Error setting language:", error);
            throw error;
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const cachedLanguage =
                    localStorage.getItem(LANGUAGE_STORAGE_KEY);
                if (cachedLanguage) {
                    setLanguageState(cachedLanguage as LanguageType);
                }
            } catch (error) {
                console.error("Error loading language:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const translate = async (text: string, toWhat?: LanguageType) => {
        const to = toWhat ?? language;
        if (!to) {
            return text;
        }
        if (to === "en") {
            return text;
        }
        try {
            const cacheKey = generateTranslateCacheKey(text, "en", to);
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                return cached;
            }

            const result = await tt(text, {
                to,
            });
            localStorage.setItem(cacheKey, result.text);

            return result.text;
        } catch {
            return text;
        }
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                loading,
                setLanguage,
                translate,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export { LanguageProvider };
