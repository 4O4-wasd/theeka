import { auth } from "@/features/auth/utils/auth";
import { LanguageSelect } from "@/features/translation";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthFlowLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <>
            <div className="absolute right-4 top-4">
                <LanguageSelect />
            </div>
            {children}
        </>
    );
}
