import { LanguageSelect } from "@/features/translation";
import {
    AppShell,
    AppShellHeader,
    AppShellMain,
    Container,
    Group,
    Text,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import LoginButton from "./login-button";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppShell header={{ height: 70 }} withBorder={false} padding={0}>
            <AppShellHeader>
                <Container size="xl" h="100%">
                    <Group h="100%" justify="space-between">
                        <Group gap="xs">
                            <Link
                                prefetch={false}
                                href="/"
                                passHref
                                className="group"
                            >
                                <Text
                                    size="xl"
                                    fw={700}
                                    c="indigo"
                                    className="group-hover:underline!"
                                >
                                    Theeka
                                </Text>
                            </Link>
                        </Group>

                        <Group gap="xs">
                            <LanguageSelect />

                            <LoginButton />
                        </Group>
                    </Group>
                </Container>
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
        </AppShell>
    );
};

export default MainLayout;
