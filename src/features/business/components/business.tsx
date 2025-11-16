"use client";

import { cn } from "@/shared";
import { Badge, Button, Card, Group, Paper, Text } from "@mantine/core";
import {
    IconBrandWhatsapp,
    IconMapPin,
    IconPhone,
    IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { BusinessSchemaType } from "../schema/business-schema";

type Props = (
    | {
          preview: true;
          href?: string;
      }
    | { preview: false }
) & {
    business: BusinessSchemaType;
};

const Business = ({ business, ...props }: Props) => {
    return (
        <Card
            key={business.id}
            padding={0}
            radius="md"
            withBorder
            component={props.preview ? Link : undefined}
            href={props.preview ? props.href ?? `/b/${business.id}` : ""}
            className={cn(props.preview && "group")}
        >
            <div className="flex sm:flex-row flex-col gap-4 p-4">
                <Paper className="sm:flex-[.2] lg:flex-[.15]">
                    <img
                        src={business.thumbnail}
                        alt={business.title}
                        style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                </Paper>

                <div className="sm:flex-[.8] lg:flex-[.85] flex flex-col">
                    <Group justify="apart" mb="xs">
                        <div style={{ flex: 1 }}>
                            <Text
                                size="xl"
                                fw={600}
                                className={cn(
                                    props.preview && "group-hover:underline!"
                                )}
                            >
                                {business.title}
                            </Text>

                            {business.totalRating && business.totalReviews ? (
                                <Group gap={4} mt={4}>
                                    <Group gap={4}>
                                        <IconStar
                                            size={16}
                                            fill="gold"
                                            color="gold"
                                        />
                                        <Text size="sm" fw={600}>
                                            {(
                                                business.totalRating /
                                                business.totalReviews
                                            )
                                                .toFixed(1)
                                                .toString()
                                                .replace(".0", "")}{" "}
                                            / 5
                                        </Text>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        ({business.totalReviews} Reviews)
                                    </Text>
                                </Group>
                            ) : (
                                <Group gap="xs" mt={4}>
                                    <Group gap={4}>
                                        <IconStar
                                            size={16}
                                            fill="gray"
                                            color="gray"
                                        />
                                        <Text size="sm" c="dimmed" fw={600}>
                                            N / A
                                        </Text>
                                    </Group>
                                </Group>
                            )}
                        </div>

                        {/* <Group gap="xs">
                            <ActionIcon
                                variant="light"
                                color="blue"
                                size="lg"
                                onClick={() => handleEdit(business)}
                            >
                                <IconEdit size={18} />
                            </ActionIcon>
                            <ActionIcon
                                variant="light"
                                color="red"
                                size="lg"
                                onClick={() => {
                                    setSelectedBusiness(business);
                                    setDeleteModalOpen(true);
                                }}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Group> */}
                    </Group>

                    <Text size="sm" c="dimmed" mb="sm" lineClamp={2}>
                        {business.description || "No description provided"}
                    </Text>

                    <Group gap={4} c="dimmed" mb="sm">
                        <IconMapPin size={14} />
                        <Text size="sm">
                            Based in {business.location.name},{" "}
                            {business.location.state} • Service range:{" "}
                            {business.radius} km
                        </Text>
                    </Group>

                    <Group gap={6} mb="md">
                        {business.categoryNames
                            .slice(0, 3)
                            .map((category, idx) => (
                                <Badge key={idx} variant="light">
                                    {category}
                                </Badge>
                            ))}
                    </Group>

                    <Group gap="xs">
                        <Button
                            leftSection={<IconPhone size={18} />}
                            variant="filled"
                            size="sm"
                        >
                            {business.professional.phoneNumbers}
                        </Button>
                        <Button
                            leftSection={<IconBrandWhatsapp size={18} />}
                            color="teal"
                            variant="filled"
                            size="sm"
                            c="white"
                        >
                            WhatsApp
                        </Button>
                    </Group>
                </div>
            </div>
        </Card>
    );
};

export { Business };
