import { auth } from "@/features/auth/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
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

    if (session && session.user.name === "") {
        redirect("/create-profile");
    }

    return children;
}
