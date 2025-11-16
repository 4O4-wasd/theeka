import { LanguageSelect } from "@/features/translation";

export default async function ProtectedAuthFlowLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="absolute right-4 top-4">
                <LanguageSelect />
            </div>
            {children}
        </>
    );
}
