"use client";

import { TT } from "@/features/translation";
import { cn } from "@/shared/utils/cn";
import {
    Button,
    Card,
    Container,
    Group,
    Stack,
    Text,
    Title,
    UnstyledButton,
} from "@mantine/core";
import { IconArrowRight, IconTie } from "@tabler/icons-react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState<
        "business" | "customer" | null
    >(null);
    const router = useRouter();

    const handleRoleSelect = (role: "business" | "customer") => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (selectedRole) {
            router.push(
                selectedRole === "customer" ? "/" : "/become-professional"
            );
        }
    };

    return (
        <Container size="xs" className="h-dvh flex items-center justify-center">
            <Card padding="xl" radius="md" className="w-full">
                <Stack gap="md">
                    <div>
                        <Title order={1} ta="center" mb="xs">
                            <TT>Choose Your Role</TT>
                        </Title>
                        <Text ta="center" c="dimmed" size="sm">
                            <TT>Select how you want to use the platform</TT>
                        </Text>
                    </div>

                    <Stack gap="md" mt="md">
                        <UnstyledButton
                            onClick={() => handleRoleSelect("business")}
                            unstyled
                            className={cn(
                                "p-4 border-2 rounded-lg transition w-full",
                                selectedRole === "business"
                                    ? "border-(--mantine-color-dark-6)"
                                    : "border-(--mantine-color-default-border)"
                            )}
                        >
                            <Group gap="md" wrap="nowrap">
                                <div
                                    className={cn(
                                        "p-2 rounded-full flex items-center justify-center",
                                        selectedRole === "business"
                                            ? "bg-(--mantine-color-dark-6) text-white"
                                            : "bg-(--mantine-color-gray-1) text-(--mantine-color-gray-6)"
                                    )}
                                >
                                    <IconTie size={20} />
                                </div>
                                <div style={{ textAlign: "left", flex: 1 }}>
                                    <Text fw={600} size="sm">
                                        <TT>Professional</TT>
                                    </Text>
                                    <Text size="xs" c="dimmed" mt={4}>
                                        <TT>
                                            Offer your services and find
                                            customers
                                        </TT>
                                    </Text>
                                </div>
                            </Group>
                        </UnstyledButton>

                        <UnstyledButton
                            onClick={() => handleRoleSelect("customer")}
                            unstyled
                            className={cn(
                                "p-4 border-2 rounded-lg transition w-full",
                                selectedRole === "customer"
                                    ? "border-(--mantine-color-dark-6)"
                                    : "border-(--mantine-color-default-border)"
                            )}
                        >
                            <Group gap="md" wrap="nowrap">
                                <div
                                    className={cn(
                                        "p-2 rounded-full flex items-center justify-center",
                                        selectedRole === "customer"
                                            ? "bg-(--mantine-color-dark-6) text-white"
                                            : "bg-(--mantine-color-gray-1) text-(--mantine-color-gray-6)"
                                    )}
                                >
                                    <User size={20} />
                                </div>
                                <div style={{ textAlign: "left", flex: 1 }}>
                                    <Text fw={600} size="sm">
                                        <TT>Customer</TT>
                                    </Text>
                                    <Text size="xs" c="dimmed" mt={4}>
                                        <TT>Find and hire Professionals</TT>
                                    </Text>
                                </div>
                            </Group>
                        </UnstyledButton>

                        <Button
                            onClick={handleContinue}
                            disabled={!selectedRole}
                            fullWidth
                            rightSection={<IconArrowRight size={16} />}
                            justify="space-between"
                        >
                            <TT>Continue</TT>
                        </Button>
                        <div className="self-center">
                            <Text size="xs" c="dimmed" mt={4}>
                                <TT>You can change the later</TT>
                            </Text>
                        </div>
                    </Stack>
                </Stack>
            </Card>
        </Container>
    );
}
