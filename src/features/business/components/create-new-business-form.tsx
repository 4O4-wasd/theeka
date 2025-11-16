"use client";

import { uploadFile } from "@/shared";
import {
    ActionIcon,
    Alert,
    Button,
    Card,
    Container,
    FileButton,
    Group,
    NumberInput,
    Paper,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
    IconPhoto,
    IconSend,
    IconShoppingBag,
    IconTrash,
    IconUpload,
    IconVideo,
} from "@tabler/icons-react";
import { Check, SkipForward, X } from "lucide-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createNewBusiness } from "../actions/create-new-business";
import {
    createBusinessSchema,
    CreateBusinessSchemaType,
} from "../schema/create-business-schema";
import CategoryAutocomplete from "./catergory-autocomplete";
import { LocationSearch } from "./location-search";
import { Map } from "./map";

const CreateNewBusinessForm = () => {
    const [submitStatus, setSubmitStatus] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [mediaFile, setMediaFiles] = useState<
        { type: "image" | "video"; url: File }[] | null
    >(null);
    const { executeAsync, result } = useAction(createNewBusiness);
    const [isPending, startTransition] = useTransition();

    const form = useForm<CreateBusinessSchemaType>({
        validate: zod4Resolver(createBusinessSchema),
        initialValues: {
            title: "",
            description: "",
            thumbnail: "",
            radius: 0,
            categoryNames: [],
            media: [],
            location: {
                name: "",
                type: "",
                postcode: "",
                country: "",
                coordinates: [],
            },
        },
    });

    const handleThumbnailSelect = (file: File | null): void => {
        if (!file) return;

        setThumbnailFile(file);

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (!e.target?.result) return;

            const url = e.target.result as string;

            form.setFieldValue("thumbnail", url);
        };

        reader.readAsDataURL(file);
    };

    const handleMediaSelect = (files: File[] | null): void => {
        if (!files || files.length === 0) return;

        const newMediaItems: Array<{
            type: "image" | "video";
            url: string;
            name: string;
        }> = [];
        let loadedCount = 0;

        files.forEach((file) => {
            const type = file.type.startsWith("video/") ? "video" : "image";

            setMediaFiles((f) => [
                {
                    type,
                    url: file,
                },
                ...(f ?? []),
            ]);
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (!e.target?.result) return;

                const url = e.target.result as string;

                newMediaItems.push({ type, url, name: file.name });
                loadedCount++;

                // Once all files are loaded, update the form
                if (loadedCount === files.length) {
                    form.setFieldValue("media", [
                        ...form.values.media,
                        ...newMediaItems,
                    ]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const removeThumbnail = (): void => {
        form.setFieldValue("thumbnail", "");
    };

    const removeMedia = (index: number): void => {
        form.setFieldValue(
            "media",
            form.values.media.filter((_, i) => i !== index)
        );
    };

    const router = useRouter();

    const handleSkip = () => {
        router.push("/");
    };

    const uploadFiles = async () => {
        const uid = crypto.randomUUID();

        const uploadPromises: Promise<{
            type: "thumbnail" | "image" | "video";
            url: string | undefined;
        }>[] = [];

        if (thumbnailFile) {
            uploadPromises.push(
                uploadFile(
                    thumbnailFile,
                    crypto.randomUUID(),
                    `theeke/business/${uid}/thumbnail`,
                    1920,
                    4
                ).then((url) => ({ type: "thumbnail", url }))
            );
        }

        if (mediaFile && mediaFile.length > 0) {
            mediaFile.forEach((m) => {
                uploadPromises.push(
                    uploadFile(
                        m.url,
                        crypto.randomUUID(),
                        `theeke/business/${uid}/media/${m.type}`,
                        1920,
                        4
                    ).then((url) => ({ type: m.type, url }))
                );
            });
        }

        const uploadResults = await Promise.all(uploadPromises);

        const thumbnailUrl = uploadResults.find(
            (r) => r.type === "thumbnail"
        )?.url;

        const mediaUrls = uploadResults
            .filter((r) => r.type === "image" || r.type === "video")
            .map((r) => r);

        return { thumbnailUrl, mediaUrls };
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <Container size="sm">
                <div className="mb-8 mx-4 my-10">
                    <Title order={1} mb="xs">
                        Create Your Business
                    </Title>
                    <Text c="dimmed">
                        Share your business with the community
                    </Text>
                </div>

                <form
                    onSubmit={form.onSubmit(async (data) => {
                        startTransition(async () => {
                            notifications.clean();

                            const id = notifications.show({
                                loading: true,
                                title: "Uploading files",
                                message:
                                    "Please wait while your files are uploading...",
                                autoClose: false,
                                withCloseButton: false,
                            });

                            const { mediaUrls, thumbnailUrl } =
                                await uploadFiles();

                            const validMediaUrls = mediaUrls.filter(
                                (v) => !!v.url
                            ) as {
                                type: "image" | "video";
                                url: string;
                            }[];

                            if (!thumbnailUrl) {
                                notifications.update({
                                    id,
                                    color: "red",
                                    title: "Error occurred",
                                    message:
                                        "There was an error while we were uploading your files",
                                    icon: <X size={18} />,
                                    loading: false,
                                    autoClose: 5000,
                                });
                                return;
                            }

                            notifications.update({
                                id,
                                title: "Creating your business",
                                message:
                                    "Please wait while we are creating your business...",
                            });

                            const { data: bId } = await executeAsync({
                                ...form.values,
                                thumbnail: thumbnailUrl,
                                media: validMediaUrls,
                            });
                            if (!bId) {
                                notifications.update({
                                    id,
                                    color: "red",
                                    title: "Error occurred",
                                    message:
                                        "There was an error while creating your business, please try again later",
                                    icon: <X size={18} />,
                                    loading: false,
                                    autoClose: 5000,
                                });
                                return;
                            }

                            notifications.update({
                                id,
                                color: "blue",
                                title: "Success",
                                message: "Your business was created",
                                icon: <Check size={18} />,
                                loading: false,
                                autoClose: 2000,
                                onClose: () => {
                                    router.push(`/profile/b/${bId}`);
                                },
                            });
                        });
                    })}
                >
                    <Stack gap="xl">
                        <Card shadow="none" radius="md">
                            <Stack gap="lg">
                                <div>
                                    <Title order={3} size="h4" mb="xs">
                                        Cover Image
                                    </Title>
                                    <Text size="sm" c="dimmed">
                                        Upload a high-quality image that
                                        represents your business
                                    </Text>
                                </div>

                                <div>
                                    {!form.values.thumbnail ? (
                                        <FileButton
                                            onChange={(file) =>
                                                handleThumbnailSelect(file)
                                            }
                                            accept="image/*"
                                        >
                                            {(props) => (
                                                <div
                                                    {...props}
                                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                                                    style={{
                                                        borderColor:
                                                            "var(--mantine-color-default-border)",
                                                    }}
                                                >
                                                    <IconUpload
                                                        size={48}
                                                        className="mb-3"
                                                        style={{
                                                            color: "var(--mantine-color-dimmed)",
                                                        }}
                                                    />
                                                    <Text fw={500} size="sm">
                                                        Click to upload cover
                                                        image
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        PNG, JPG or WEBP
                                                        (recommended:
                                                        1200x630px)
                                                    </Text>
                                                </div>
                                            )}
                                        </FileButton>
                                    ) : (
                                        <Paper
                                            withBorder
                                            className="relative w-full h-64"
                                        >
                                            <img
                                                src={form.values.thumbnail}
                                                alt="Cover preview"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                            <ActionIcon
                                                color="red"
                                                variant="filled"
                                                className="!absolute top-2 right-2"
                                                onClick={removeThumbnail}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Paper>
                                    )}
                                    {form.errors.thumbnail && (
                                        <Text size="sm" c="red" mt="xs">
                                            {form.errors.thumbnail}
                                        </Text>
                                    )}
                                </div>
                            </Stack>
                        </Card>

                        <Card shadow="none" radius="md">
                            <Stack gap="lg">
                                <div>
                                    <Title order={3} size="h4" mb="xs">
                                        Basic Information
                                    </Title>
                                    <Text size="sm" c="dimmed">
                                        Tell us about your business
                                    </Text>
                                </div>

                                <TextInput
                                    label="Business Name"
                                    placeholder="e.g., Joe's Coffee Shop"
                                    rightSection={<IconShoppingBag size={16} />}
                                    {...form.getInputProps("title")}
                                />

                                <CategoryAutocomplete
                                    error={form.errors.categoryNames}
                                    categoryNames={form.values.categoryNames}
                                    setCategoryNames={(c) =>
                                        form.setFieldValue("categoryNames", c)
                                    }
                                />

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <LocationSearch
                                        className="flex-1"
                                        onChange={(city) => {
                                            form.setFieldValue(
                                                "location",
                                                city
                                            );
                                        }}
                                        label="Location (where your business is from)"
                                        placeholder="Search address..."
                                    />
                                    <div className="flex-1 sm:flex-[0.4]">
                                        <NumberInput
                                            label="Location Radius (km)"
                                            placeholder="Input radius"
                                            {...form.getInputProps("radius")}
                                        />
                                        <Text size="xs" c="dimmed" mt="xs">
                                            Define the maximum distance you can
                                            operate within.
                                        </Text>
                                    </div>
                                </div>

                                {form.values.location.coordinates.length ===
                                    2 &&
                                    form.values.radius >= 1 && (
                                        <div className="h-64 w-full">
                                            <Map
                                                {...{
                                                    name: form.values.location
                                                        .name,
                                                    lat: form.values.location
                                                        .coordinates[1],
                                                    lng: form.values.location
                                                        .coordinates[0],
                                                    serviceRadius:
                                                        form.values.radius,
                                                }}
                                            />
                                        </div>
                                    )}

                                <Textarea
                                    label="About Your Business (optional)"
                                    placeholder="Share what makes your business special, your story, services offered..."
                                    minRows={5}
                                    autosize
                                    {...form.getInputProps("description")}
                                />
                            </Stack>
                        </Card>

                        <Card shadow="none" radius="md">
                            <Stack gap="lg">
                                <div>
                                    <Title order={3} size="h4" mb="xs">
                                        Media Gallery
                                    </Title>
                                    <Text size="sm" c="dimmed">
                                        Upload images and videos to showcase
                                        your business (optional)
                                    </Text>
                                </div>

                                <FileButton
                                    onChange={handleMediaSelect}
                                    accept="image/*,video/*"
                                    multiple
                                >
                                    {(props) => (
                                        <div
                                            {...props}
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                                            style={{
                                                borderColor:
                                                    "var(--mantine-color-default-border)",
                                            }}
                                        >
                                            <Group gap="xs" mb="sm">
                                                <IconPhoto
                                                    size={32}
                                                    style={{
                                                        color: "var(--mantine-color-dimmed)",
                                                    }}
                                                />
                                                <IconVideo
                                                    size={32}
                                                    style={{
                                                        color: "var(--mantine-color-dimmed)",
                                                    }}
                                                />
                                            </Group>
                                            <Text fw={500} size="sm">
                                                Add photos & videos
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                PNG, JPG, WEBP, MP4, WEBM or MOV
                                            </Text>
                                        </div>
                                    )}
                                </FileButton>

                                {form.values.media.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {form.values.media.map(
                                            (item, index) => (
                                                <Paper
                                                    withBorder
                                                    key={index}
                                                    className="relative w-full h-32"
                                                >
                                                    {item.type === "image" ? (
                                                        <img
                                                            src={item.url}
                                                            alt={`Media ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-full object-contain rounded-lg"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={item.url}
                                                            className="w-full h-full object-contain rounded-lg"
                                                            controls
                                                        />
                                                    )}
                                                    <ActionIcon
                                                        color="red"
                                                        variant="filled"
                                                        className="!absolute top-2 right-2"
                                                        onClick={() =>
                                                            removeMedia(index)
                                                        }
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Paper>
                                            )
                                        )}
                                    </div>
                                )}
                            </Stack>
                        </Card>

                        {submitStatus && (
                            <Alert
                                color={
                                    submitStatus.type === "error"
                                        ? "red"
                                        : "green"
                                }
                            >
                                {submitStatus.message}
                            </Alert>
                        )}

                        <div className="mx-4 pb-2 flex z-20 gap-4 sticky bottom-0">
                            <Button
                                type="button"
                                variant="default"
                                justify="space-between"
                                rightSection={<SkipForward size={16} />}
                                onClick={handleSkip}
                                className="flex-1"
                            >
                                Skip
                            </Button>
                            <Button
                                type="submit"
                                justify="space-between"
                                rightSection={<IconSend size={16} />}
                                className="flex-1"
                            >
                                Create Business
                            </Button>
                        </div>
                    </Stack>
                </form>
            </Container>
        </div>
    );
};

export { CreateNewBusinessForm };
