"use client";

import {
    ActionIcon,
    Anchor,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import {
    IconBrandWhatsapp,
    IconClock,
    IconMapPin,
    IconPhone,
    IconShare,
    IconStar,
    IconStarFilled,
} from "@tabler/icons-react";
import { BusinessSchemaType } from "../schema/business-schema";

import "@mantine/carousel/styles.css";

const BusinessViewer = ({ business }: { business: BusinessSchemaType }) => {
    const reviews = [
        {
            id: "1",
            userName: "Priya Sharma",
            rating: 5,
            comment:
                "Excellent service! Very professional and arrived on time. Fixed our leaking pipe quickly and efficiently.",
            date: new Date("2024-11-01"),
            avatar: "PS",
        },
        {
            id: "2",
            userName: "Amit Reddy",
            rating: 5,
            comment:
                "Highly recommend! They handled our emergency plumbing issue at midnight. Very reliable.",
            date: new Date("2024-10-28"),
            avatar: "AR",
        },
        {
            id: "3",
            userName: "Lakshmi Devi",
            rating: 4,
            comment:
                "Good work overall. Pricing was fair and the plumber was knowledgeable. Would use again.",
            date: new Date("2024-10-15"),
            avatar: "LD",
        },
        {
            id: "4",
            userName: "Karthik M",
            rating: 5,
            comment:
                "Outstanding service! They installed new pipes in our home and the quality of work was top-notch.",
            date: new Date("2024-10-10"),
            avatar: "KM",
        },
        {
            id: "5",
            userName: "Sneha Rao",
            rating: 4,
            comment:
                "Very satisfied with the service. Quick response time and professional attitude.",
            date: new Date("2024-09-25"),
            avatar: "SR",
        },
    ];

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter((r) => r.rating === rating).length;
        const percentage =
            reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { rating, count, percentage };
    });

    const rating =
        business.totalRating && business.totalReviews
            ? (business.totalRating / business.totalReviews).toFixed(1)
            : "N/A";

    const handleWhatsApp = () => {
        window.open(
            `https://wa.me/91${business.professional.phoneNumbers[0]}`,
            "_blank"
        );
    };

    const handleCall = () => {
        window.location.href = `tel:+91${business.professional.phoneNumbers[0]}`;
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: business.title,
                text: business.description ?? undefined,
                url: window.location.href,
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Header/Image Gallery */}

            <div className="pb-10 pt-4 w-full grid md:grid-cols-2 gap-4">
                <img
                    src={business.thumbnail}
                    alt="Thumbnail"
                    className="aspect-video object-cover rounded-xl"
                />
                <div className="grid grid-cols-2 gap-2">
                    {business.media.slice(0, 3).map((media, idx) => (
                        <button
                            key={idx}
                            className="[all:unset] rounded-xl relative!"
                        >
                            {idx}
                            {media.type === "video" ? (
                                <video src={media.url} className="rounded-xl" />
                            ) : (
                                <img
                                    src={media.url}
                                    className="rounded-xl"
                                    alt={`${business.title} ${idx + 1}`}
                                />
                            )}
                        </button>
                    ))}
                    <img
                        src={business.thumbnail}
                        alt="Thumbnail"
                        className="aspect-video object-cover rounded-xl"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div>
                <Grid gutter="xl">
                    {/* Left Column - Main Info */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="lg">
                            {/* Title and Rating */}
                            <Card padding="lg" radius="md" withBorder>
                                <Group justify="space-between" mb="md">
                                    <div>
                                        <Title order={1} mb="xs">
                                            {business.title}
                                        </Title>
                                        <Group gap="md">
                                            <Group gap={4}>
                                                <IconStar
                                                    size={20}
                                                    fill="gold"
                                                    color="gold"
                                                />
                                                <Text size="lg" fw={600}>
                                                    {rating}
                                                </Text>
                                                <Text c="dimmed">/ 5</Text>
                                            </Group>
                                            {business.totalReviews && (
                                                <Text c="dimmed">
                                                    ({business.totalReviews}{" "}
                                                    Reviews)
                                                </Text>
                                            )}
                                        </Group>
                                    </div>
                                    <ActionIcon
                                        variant="light"
                                        size="lg"
                                        radius="md"
                                        onClick={handleShare}
                                    >
                                        <IconShare size={20} />
                                    </ActionIcon>
                                </Group>

                                {/* Categories */}
                                <Group gap="xs" mb="md">
                                    {business.categoryNames.map(
                                        (category, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="light"
                                                size="lg"
                                            >
                                                {category}
                                            </Badge>
                                        )
                                    )}
                                </Group>

                                {/* Location */}
                                <Group gap="xs" align="flex-start">
                                    <IconMapPin
                                        size={20}
                                        style={{ marginTop: 2 }}
                                    />
                                    <div>
                                        <Text fw={500}>
                                            {business.location.name},{" "}
                                            {business.location.city},{" "}
                                            {business.location.state}{" "}
                                            {business.location.postcode}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            Service radius: {business.radius} km
                                        </Text>
                                    </div>
                                </Group>
                            </Card>

                            {/* Description */}
                            <Card padding="lg" radius="md" withBorder>
                                <Title order={2} size="h3" mb="md">
                                    About
                                </Title>
                                <Text c="dimmed">
                                    {business.description ||
                                        "No description provided"}
                                </Text>
                            </Card>

                            {/* Professional Info */}
                            <Card padding="lg" radius="md" withBorder>
                                <Title order={2} size="h3" mb="md">
                                    Professional
                                </Title>
                                <Group gap="md" align="flex-start">
                                    <Avatar size="lg" radius="xl" color="blue">
                                        {business.professional.professionalName.charAt(
                                            0
                                        )}
                                    </Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text fw={600} size="lg">
                                            {
                                                business.professional
                                                    .professionalName
                                            }
                                        </Text>
                                        <Text c="dimmed" mt={4}>
                                            {business.professional.bio ||
                                                "Professional service provider"}
                                        </Text>
                                        <Group gap="xs" mt="sm">
                                            {business.professional.phoneNumbers.map(
                                                (phone, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="light"
                                                        color="gray"
                                                        size="lg"
                                                        leftSection={
                                                            <IconPhone
                                                                size={14}
                                                            />
                                                        }
                                                    >
                                                        {phone}
                                                    </Badge>
                                                )
                                            )}
                                        </Group>
                                    </div>
                                </Group>
                            </Card>

                            {/* Reviews Section */}
                            <Card padding="lg" radius="md" withBorder>
                                <Title order={2} size="h3" mb="md">
                                    Customer Reviews
                                </Title>

                                {/* Rating Overview */}
                                <Paper
                                    withBorder
                                    p="lg"
                                    radius="md"
                                    mb="lg"
                                    bg="gray.0"
                                >
                                    <Grid>
                                        <Grid.Col span={{ base: 12, sm: 4 }}>
                                            <Stack align="center" gap="xs">
                                                <Text size="3rem" fw={700}>
                                                    {rating}
                                                </Text>
                                                <Group gap={4}>
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <IconStarFilled
                                                                key={star}
                                                                size={20}
                                                                color={
                                                                    star <=
                                                                    parseFloat(
                                                                        rating
                                                                    )
                                                                        ? "gold"
                                                                        : "var(--mantine-color-gray-3)"
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    Based on{" "}
                                                    {business.totalReviews}{" "}
                                                    reviews
                                                </Text>
                                            </Stack>
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, sm: 8 }}>
                                            <Stack gap="xs">
                                                {ratingDistribution.map(
                                                    ({
                                                        rating: r,
                                                        count,
                                                        percentage,
                                                    }) => (
                                                        <Group
                                                            key={r}
                                                            gap="sm"
                                                            wrap="nowrap"
                                                        >
                                                            <Group
                                                                gap={4}
                                                                style={{
                                                                    minWidth: 60,
                                                                }}
                                                            >
                                                                <Text
                                                                    size="sm"
                                                                    fw={500}
                                                                >
                                                                    {r}
                                                                </Text>
                                                                <IconStarFilled
                                                                    size={14}
                                                                    color="gold"
                                                                />
                                                            </Group>
                                                            <Box
                                                                style={{
                                                                    flex: 1,
                                                                    position:
                                                                        "relative",
                                                                    height: 8,
                                                                    backgroundColor:
                                                                        "var(--mantine-color-gray-2)",
                                                                    borderRadius: 4,
                                                                }}
                                                            >
                                                                <Box
                                                                    style={{
                                                                        position:
                                                                            "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        height: "100%",
                                                                        width: `${percentage}%`,
                                                                        backgroundColor:
                                                                            "var(--mantine-color-blue-6)",
                                                                        borderRadius: 4,
                                                                        transition:
                                                                            "width 0.3s ease",
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Text
                                                                size="sm"
                                                                c="dimmed"
                                                                style={{
                                                                    minWidth: 40,
                                                                }}
                                                            >
                                                                {count}
                                                            </Text>
                                                        </Group>
                                                    )
                                                )}
                                            </Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Paper>

                                {/* Individual Reviews */}
                                <Stack gap="md">
                                    {reviews.map((review) => (
                                        <Paper
                                            key={review.id}
                                            withBorder
                                            p="md"
                                            radius="md"
                                        >
                                            <Group align="flex-start" gap="md">
                                                <Avatar
                                                    size="md"
                                                    radius="xl"
                                                    color="blue"
                                                >
                                                    {review.avatar}
                                                </Avatar>
                                                <div style={{ flex: 1 }}>
                                                    <Group
                                                        justify="space-between"
                                                        mb="xs"
                                                    >
                                                        <div>
                                                            <Text fw={600}>
                                                                {
                                                                    review.userName
                                                                }
                                                            </Text>
                                                            <Group
                                                                gap={4}
                                                                mt={2}
                                                            >
                                                                {[
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ].map(
                                                                    (star) => (
                                                                        <IconStarFilled
                                                                            key={
                                                                                star
                                                                            }
                                                                            size={
                                                                                14
                                                                            }
                                                                            color={
                                                                                star <=
                                                                                review.rating
                                                                                    ? "gold"
                                                                                    : "var(--mantine-color-gray-3)"
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </Group>
                                                        </div>
                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                        >
                                                            {review.date.toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </Text>
                                                    </Group>
                                                    <Text size="sm" c="dimmed">
                                                        {review.comment}
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid.Col>

                    {/* Right Column - Contact Card */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="lg">
                            <Card padding="lg" radius="md" withBorder>
                                <Title order={3} mb="md">
                                    Get in Touch
                                </Title>

                                <Stack gap="xs">
                                    <Button
                                        leftSection={<IconPhone size={20} />}
                                        variant="filled"
                                        size="md"
                                        fullWidth
                                        onClick={handleCall}
                                    >
                                        Call Now
                                    </Button>

                                    <Button
                                        leftSection={
                                            <IconBrandWhatsapp
                                                size={22}
                                                className="translate-x-0.5"
                                            />
                                        }
                                        color="teal"
                                        variant="filled"
                                        size="md"
                                        fullWidth
                                        onClick={handleWhatsApp}
                                        c="white"
                                    >
                                        WhatsApp
                                    </Button>
                                </Stack>

                                <Divider my="lg" />

                                <div>
                                    <Text fw={600} mb="sm">
                                        Contact Numbers
                                    </Text>
                                    <Stack gap="xs">
                                        {business.professional.phoneNumbers.map(
                                            (phone, idx) => (
                                                <Group key={idx} gap="xs">
                                                    <IconPhone size={16} />
                                                    <Anchor
                                                        href={`tel:+91${phone}`}
                                                        c="dimmed"
                                                    >
                                                        +91 {phone}
                                                    </Anchor>
                                                </Group>
                                            )
                                        )}
                                    </Stack>
                                </div>

                                <Divider my="lg" />

                                <div>
                                    <Text fw={600} mb="sm">
                                        Business Hours
                                    </Text>
                                    <Group gap="xs" align="flex-start">
                                        <IconClock
                                            size={16}
                                            style={{ marginTop: 2 }}
                                        />
                                        <div>
                                            <Text size="sm">
                                                Available 24/7
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Emergency services available
                                            </Text>
                                        </div>
                                    </Group>
                                </div>

                                <Divider my="lg" />

                                <Text size="xs" c="dimmed" ta="center">
                                    Member since{" "}
                                    {new Date(
                                        business.createdAt
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </Text>
                            </Card>

                            {/* Service Area Card */}
                            <Card padding="lg" radius="md" withBorder>
                                <Title order={3} size="h4" mb="md">
                                    Service Area
                                </Title>
                                <Paper
                                    withBorder
                                    p="md"
                                    radius="md"
                                    bg="gray.1"
                                >
                                    <Box
                                        h={200}
                                        bg="gray.2"
                                        style={{
                                            borderRadius:
                                                "var(--mantine-radius-md)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Group gap="xs">
                                            <IconMapPin
                                                size={36}
                                                color="var(--mantine-color-gray-5)"
                                            />
                                            <Text c="dimmed">Map</Text>
                                        </Group>
                                    </Box>
                                    <Text size="sm" c="dimmed" mt="md">
                                        Serving {business.location.city} and
                                        surrounding areas within{" "}
                                        {business.radius} km radius
                                    </Text>
                                </Paper>
                            </Card>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </div>
        </div>
    );
};

export { BusinessViewer };
