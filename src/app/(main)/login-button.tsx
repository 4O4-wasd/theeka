import { auth } from "@/features/auth/utils/auth";
import { Avatar, Button } from "@mantine/core";
import { headers } from "next/headers";
import Link from "next/link";

const LoginButton = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return !session ? (
        <Link passHref href="/sign-in">
            <Button variant="default">Login</Button>
        </Link>
    ) : session.user.name === "" ? (
        <Link passHref href="/create-profile">
            <Button>Create Profile</Button>
        </Link>
    ) : (
        <Link passHref href="/profile">
            <Avatar
                size="md"
                src={session.user.image}
                alt={session.user.name}
            />
        </Link>
    );
};

export default LoginButton;
