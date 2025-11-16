"use client";

import { TT } from "@/features/translation";
import contractorCategories from "@/shared/constants/contractors";
import {
    Badge,
    Box,
    Button,
    Card,
    Container,
    Flex,
    Grid,
    Group,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { IconChevronRight, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LocationInput from "./location";

export default function ContractorExploreContent() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const allContractors = Object.entries(contractorCategories).flatMap(
        ([categoryName, category]) =>
            category.contractors.map((contractor) => ({
                ...contractor,
                category: categoryName,
                categoryColor: category.color,
                categoryBgColor: category.bgColor,
            }))
    );

    const filteredContractors = selectedCategory
        ? allContractors.filter((c) => c.category === selectedCategory)
        : allContractors;

    const router = useRouter();

    return (
        <>
            {/* Hero Section */}
            <Box>
                <Container size="xl" py={48}>
                    <Stack gap="md" mb="xl">
                        <Title order={1}>
                            <TT>Find the Right Contractor</TT>
                        </Title>
                        <Text size="lg" c="dimmed">
                            Connect with skilled professionals for your home and
                            business needs
                        </Text>
                    </Stack>

                    <div className="flex gap-2 shrink-0 flex-col">
                        <TextInput
                            placeholder="Search for electricians, plumbers, carpenters..."
                            leftSection={<IconSearch size={16} />}
                            className="!flex-[0.6]"
                            size="lg"
                            onKeyDown={(e) => {
                                if (e.key === "enter") {
                                    router.push(
                                        `/search/${e.currentTarget.value}`
                                    );
                                }
                            }}
                        />
                        <LocationInput className="!flex-[0.4]" />
                    </div>
                </Container>
            </Box>

            <Container size="xl">
                <Group justify="space-between" mb="xl">
                    <Title order={2}>Browse by Category</Title>
                    {selectedCategory && (
                        <Button
                            variant="subtle"
                            onClick={() => setSelectedCategory(null)}
                        >
                            Clear filter
                        </Button>
                    )}
                </Group>
                <Grid gutter="md" mb={48}>
                    {Object.entries(contractorCategories).map(
                        ([categoryName, category]) => {
                            const Icon = category.icon;
                            const isSelected =
                                selectedCategory === categoryName;
                            return (
                                <Grid.Col
                                    key={categoryName}
                                    span={{ base: 6, sm: 4, md: 3 }}
                                >
                                    <Card
                                        withBorder
                                        shadow="xs"
                                        padding="lg"
                                        style={{
                                            cursor: "pointer",
                                            border: isSelected
                                                ? "2px solid var(--mantine-color-blue-6)"
                                                : undefined,
                                        }}
                                        onClick={() => {
                                            setSelectedCategory(categoryName);
                                        }}
                                    >
                                        <Flex
                                            w={48}
                                            h={48}
                                            bg="indigo.1"
                                            style={{ borderRadius: "50%" }}
                                            align="center"
                                            justify="center"
                                            mb="sm"
                                        >
                                            <Icon
                                                size={24}
                                                color="var(--mantine-color-indigo-9)"
                                            />
                                        </Flex>
                                        <Text fw={600} size="sm">
                                            {categoryName}
                                        </Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {category.contractors.length}{" "}
                                            services
                                        </Text>
                                    </Card>
                                </Grid.Col>
                            );
                        }
                    )}
                </Grid>
                {/* Results Section */}
                <Stack gap="xl" pb={200}>
                    <Group justify="space-between">
                        <Title order={2}>
                            {selectedCategory
                                ? selectedCategory
                                : "All Services"}
                        </Title>
                        <Text size="sm" c="dimmed">
                            {filteredContractors.length} services available
                        </Text>
                    </Group>

                    <Grid gutter="md">
                        {filteredContractors.map((contractor, idx) => (
                            <Grid.Col
                                key={idx}
                                span={{ base: 12, sm: 6, md: 4 }}
                            >
                                <Card
                                    padding="lg"
                                    withBorder
                                    className="h-full cursor-pointer"
                                    component={Link}
                                    prefetch={false}
                                    href={`/search/${contractor.name}`}
                                >
                                    <Group
                                        align="flex-start"
                                        justify="space-between"
                                        wrap="nowrap"
                                    >
                                        <Group align="flex-start" gap="md">
                                            <Text size="2rem">
                                                {contractor.icon}
                                            </Text>
                                            <Stack gap="xs" style={{ flex: 1 }}>
                                                <Text fw={600}>
                                                    <TT>{contractor.name}</TT>
                                                </Text>
                                                <Badge
                                                    variant="default"
                                                    size="sm"
                                                >
                                                    <TT>
                                                        {contractor.category}
                                                    </TT>
                                                </Badge>
                                                <Text size="sm" c="dimmed">
                                                    <TT>
                                                        {contractor.description}
                                                    </TT>
                                                </Text>
                                            </Stack>
                                        </Group>
                                        <IconChevronRight
                                            size={20}
                                            style={{ flexShrink: 0 }}
                                        />
                                    </Group>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>

                    {filteredContractors.length === 0 && (
                        <Stack align="center" py={64}>
                            <Text size="4rem">🔍</Text>
                            <Title order={3}>No contractors found</Title>
                            <Text c="dimmed">
                                Try adjusting your search or browse all
                                categories
                            </Text>
                        </Stack>
                    )}
                </Stack>
            </Container>
        </>
    );
}
