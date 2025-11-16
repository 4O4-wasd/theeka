import { getAllBusinesses } from "@/features/business/actions/get-all-businesses";
import { Business } from "@/features/business/components/business";
import { getProfessional } from "@/features/professional/actions/get-professional";
import { a } from "@/shared/action-clients/a";
import {
    Avatar,
    Badge,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { IconEdit, IconPhone, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

// Types based on your schema
interface City {
    name: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
}

export default async function ProfilePage() {
    const user = (await a())?.user;
    const professional = (await getProfessional()).data;

    if (!user || !professional) {
        throw new Error("User/Professional not found");
    }

    const businesses = (await getAllBusinesses()).data;
    return (
        <div className="max-w-7xl mx-auto p-6 py-12">
            {/* Profile Section */}
            <Paper radius="md" withBorder mb="xl">
                <div className="p-4">
                    <Group justify="space-between" mb="xl">
                        <Group>
                            <Avatar src={user.image} size={120} radius="md" />
                            <Stack gap="xs">
                                <Title order={2}>
                                    {professional.professionalName}
                                </Title>
                                <Text c="dimmed">{user.email}</Text>
                                <Group gap="xs">
                                    {professional.phoneNumbers?.map(
                                        (phone, idx) => (
                                            <Badge
                                                key={idx}
                                                leftSection={
                                                    <IconPhone size={14} />
                                                }
                                                variant="light"
                                            >
                                                {phone}
                                            </Badge>
                                        )
                                    )}
                                </Group>
                            </Stack>
                        </Group>
                        <Button leftSection={<IconEdit size={16} />}>
                            Edit Profile
                        </Button>
                    </Group>

                    <Stack gap="md">
                        <div>
                            <Text fw={600} mb="xs">
                                Bio
                            </Text>
                            <Text c="dimmed">
                                {professional.bio || "No bio added yet"}
                            </Text>
                        </div>
                    </Stack>
                </div>
            </Paper>

            <Divider my="xl" />

            {/* Businesses Section */}
            <div>
                <Group justify="space-between" mb="xl">
                    <Title order={3}>Your Businesses</Title>
                    <Link passHref href="/create-new-business">
                        <Button leftSection={<IconPlus size={16} />}>
                            Add Business
                        </Button>
                    </Link>
                </Group>

                <div className="space-y-6">
                    {businesses?.map((business) => (
                        <Business
                            preview
                            business={{
                                ...business,
                                professional,
                            }}
                            href={`/profile/b/${business.id}`}
                            key={business.id}
                        />
                    ))}
                </div>

                {!businesses ||
                    (businesses.length === 0 && (
                        <Paper p="xl" ta="center" c="dimmed">
                            <Text>
                                No businesses yet. Create your first business to
                                get started!
                            </Text>
                        </Paper>
                    ))}
            </div>
        </div>
    );
}
