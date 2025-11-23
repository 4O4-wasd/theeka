import { auth } from "@/features/auth/utils/auth";
import { Button } from "@/shared/components/ui/button";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/shared/components/ui/avatar";
import { headers } from "next/headers";
import Link from "next/link";

const LoginButton = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return !session ? (
        <Link href="/sign-in">
            <Button variant="outline">Login</Button>
        </Link>
    ) : session.user.name === "" ? (
        <Link href="/create-profile">
            <Button>Create Profile</Button>
        </Link>
    ) : (
        <Link href="/profile">
            <Avatar className="h-10 w-10">
                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
    );
};

export default LoginButton;
