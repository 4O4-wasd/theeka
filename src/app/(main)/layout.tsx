import { LanguageSelect } from "@/features/translation";
import Text from "@/shared/components/ui/text";
import Link from "next/link";
import React from "react";
import LoginButton from "./login-button";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="max-w-6xl mx-auto md:border-x-2 min-h-dvh relative">
            <header className="border-b-2 sticky top-0 z-100 bg-background/50 backdrop-blur-2xl w-full">
                <div className="py-2 px-3">
                    <div className="h-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link prefetch={false} href="/" className="group">
                                <Text className="text-xl font-bold text-indigo-600 group-hover:underline">
                                    Theeka
                                </Text>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <LanguageSelect />
                            <LoginButton />
                        </div>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default MainLayout;
