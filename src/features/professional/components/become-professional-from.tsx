"use client";

import { TT } from "@/features/translation";
import { defaultUserSchema } from "@/shared/schemas";
import {
    ActionIcon,
    Button,
    Card,
    Container,
    Group,
    NumberInput,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
    IconArrowRight,
    IconBriefcase,
    IconPhone,
    IconPlus,
    IconX,
} from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import z from "zod";
import { createProfessionalProfile } from "../actions/create-professional-profile";
import {
    CreateProfessionalProfileFormValues,
    createProfessionalProfileSchema,
} from "../schema/create-professional";

const BecomeProfessionalFrom = ({
    user,
}: {
    user: z.infer<typeof defaultUserSchema>;
}) => {
    const router = useRouter();
    const { execute, isTransitioning: isSubmitting } = useAction(
        createProfessionalProfile,
        {
            onSuccess() {
                router.push("/create-new-business");
            },
        }
    );

    const form = useForm<CreateProfessionalProfileFormValues>({
        validate: zod4Resolver(createProfessionalProfileSchema),
        initialValues: {
            professionalName: user.name,
            phoneNumbers: [0],
        },
    });

    const addPhone = () => {
        form.insertListItem("phoneNumbers", "");
    };

    const removePhone = (index: number) => {
        if (form.values.phoneNumbers.length > 1) {
            form.removeListItem("phoneNumbers", index);
        }
    };

    const handleSubmit = (values: CreateProfessionalProfileFormValues) => {
        execute(values);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Container size="xs" className="w-full py-24">
                <Card
                    padding="xl"
                    radius="md"
                    shadow="none"
                    className="border-0"
                >
                    <Stack gap="xl">
                        <div>
                            <Title order={1} ta="center" mb="xs">
                                <TT>Create Business Profile</TT>
                            </Title>
                            <Text ta="center" c="dimmed" size="sm">
                                Set up your professional profile to connect with
                                customers
                            </Text>
                        </div>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="lg">
                                <TextInput
                                    label="Professional Name"
                                    placeholder="Akash Singh"
                                    leftSection={<IconBriefcase size={16} />}
                                    disabled={isSubmitting}
                                    {...form.getInputProps("professionalName")}
                                />

                                <div>
                                    <Group justify="space-between" mb="xs">
                                        <Text size="sm" fw={500}>
                                            Phone Number(s)
                                        </Text>
                                        <ActionIcon
                                            variant="subtle"
                                            onClick={addPhone}
                                            size="sm"
                                        >
                                            <IconPlus size={16} />
                                        </ActionIcon>
                                    </Group>
                                    <Stack gap="xs">
                                        {form.values.phoneNumbers.map(
                                            (_, index) => (
                                                <Group
                                                    key={index}
                                                    gap="xs"
                                                    wrap="nowrap"
                                                >
                                                    <NumberInput
                                                        placeholder="1234567890"
                                                        disabled={isSubmitting}
                                                        type="tel"
                                                        maxLength={10}
                                                        leftSection={
                                                            <IconPhone
                                                                size={16}
                                                            />
                                                        }
                                                        className="flex-1"
                                                        {...form.getInputProps(
                                                            `phoneNumbers.${index}`
                                                        )}
                                                    />
                                                    {form.values.phoneNumbers
                                                        .length > 1 && (
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="red"
                                                            onClick={() =>
                                                                removePhone(
                                                                    index
                                                                )
                                                            }
                                                            loading={
                                                                isSubmitting
                                                            }
                                                            size="lg"
                                                        >
                                                            <IconX size={16} />
                                                        </ActionIcon>
                                                    )}
                                                </Group>
                                            )
                                        )}
                                    </Stack>
                                </div>

                                <Group gap="xs" grow>
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        rightSection={
                                            <IconArrowRight size={16} />
                                        }
                                        justify="space-between"
                                    >
                                        Continue
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Stack>
                </Card>
            </Container>
        </div>
    );
};

export { BecomeProfessionalFrom };
