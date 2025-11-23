"use client";

import { uploadFile } from "@/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Separator } from "@/shared/components/ui/separator";

import { Check, SkipForward, X, Upload, Image as ImageIcon, Video, Trash2, Send, ShoppingBag } from "lucide-react";
import { createNewBusiness } from "../actions/create-new-business";
import {
    createBusinessSchema,
    CreateBusinessSchemaType,
} from "../schema/create-business-schema";
import CategoryAutocomplete from "./catergory-autocomplete";
import { LocationSearch } from "./location-search";
import { Map } from "./map";
import { useAction } from "next-safe-action/hooks";

const CreateNewBusinessForm = () => {
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [mediaFiles, setMediaFiles] = useState<
        { type: "image" | "video"; url: File }[]
    >([]);
    const { executeAsync, result } = useAction(createNewBusiness);
    const [isPending, startTransition] = useTransition();

    const form = useForm<CreateBusinessSchemaType>({
        resolver: zodResolver(createBusinessSchema),
        defaultValues: {
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

    const watch = form.watch;

    const handleThumbnailSelect = (file: File | null): void => {
        if (!file) return;

        setThumbnailFile(file);

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (!e.target?.result) return;

            const url = e.target.result as string;

            form.setValue("thumbnail", url);
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
                    form.setValue("media", [
                        ...form.getValues().media,
                        ...newMediaItems,
                    ]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const removeThumbnail = (): void => {
        form.setValue("thumbnail", "");
        setThumbnailFile(null);
    };

    const removeMedia = (index: number): void => {
        form.setValue(
            "media",
            form.getValues().media.filter((_, i) => i !== index)
        );
        setMediaFiles((prev) => prev?.filter((_, i) => i !== form.getValues().media.length - index - 1) || null);
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

        if (mediaFiles && mediaFiles.length > 0) {
            mediaFiles.forEach((m) => {
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
            .map((r) => r as { type: "image" | "video"; url: string });

        return { thumbnailUrl, mediaUrls };
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold">Create Your Business</h1>
                    <p className="text-muted-foreground">
                        Share your business with the community
                    </p>
                </div>

                <form
                    onSubmit={form.handleSubmit(async (data) => {
                        startTransition(async () => {
                            const id = toast.loading("Uploading files", {
                                description:
                                    "Please wait while your files are uploading...",
                            });

                            const { mediaUrls, thumbnailUrl } =
                                await uploadFiles();

                            const validMediaUrls = mediaUrls.filter(
                                (v) => !!v.url
                            );

                            if (!thumbnailUrl) {
                                toast.dismiss(id);
                                toast.error("Error occurred", {
                                    description:
                                        "There was an error while we were uploading your files",
                                });
                                return;
                            }

                            toast.dismiss(id);
                            const createId = toast.loading(
                                "Creating your business",
                                {
                                    description:
                                        "Please wait while we are creating your business...",
                                }
                            );

                            const { data: bId } = await executeAsync({
                                ...data,
                                thumbnail: thumbnailUrl,
                                media: validMediaUrls,
                            });
                            if (!bId) {
                                toast.dismiss(createId);
                                toast.error("Error occurred", {
                                    description:
                                        "There was an error while creating your business, please try again later",
                                });
                                return;
                            }

                            toast.dismiss(createId);
                            toast.success("Success", {
                                description: "Your business was created",
                                duration: 2000,
                            });
                            setTimeout(() => {
                                router.push(`/profile/b/${bId}`);
                            }, 2000);
                        });
                    })}
                    className="space-y-8"
                >
                    <Card>
                        <CardHeader className="space-y-4">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">
                                    Cover Image
                                </CardTitle>
                                <CardDescription>
                                    Upload a high-quality image that represents
                                    your business
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {!watch("thumbnail") ? (
                                    <>
                                        <label
                                            htmlFor="thumbnail-upload"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-muted border-border"
                                        >
                                            <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                                            <span className="font-medium text-sm">
                                                Click to upload cover image
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                PNG, JPG or WEBP (recommended:
                                                1200x630px)
                                            </span>
                                        </label>
                                        <input
                                            id="thumbnail-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleThumbnailSelect(
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                            className="sr-only"
                                        />
                                    </>
                                ) : (
                                    <div className="relative w-full h-64 border border-border rounded-lg overflow-hidden">
                                        <img
                                            src={watch("thumbnail")}
                                            alt="Cover preview"
                                            className="w-full h-full object-contain"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={removeThumbnail}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                {form.formState.errors.thumbnail && (
                                    <p className="text-sm text-destructive">
                                        {
                                            form.formState.errors.thumbnail
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-4">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Tell us about your business
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Business Name</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Joe's Coffee Shop"
                                    {...form.register("title")}
                                />
                                {form.formState.errors.title && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.title.message}
                                    </p>
                                )}
                            </div>

                            <CategoryAutocomplete
                                error={
                                    form.formState.errors.categoryNames?.message
                                }
                                categoryNames={watch("categoryNames")}
                                setCategoryNames={(c) =>
                                    form.setValue("categoryNames", c)
                                }
                            />

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="flex-1">
                                    <LocationSearch
                                        className="flex-1"
                                        onChange={(city) => {
                                            form.setValue("location", city);
                                        }}
                                        label="Location (where your business is from)"
                                        placeholder="Search address..."
                                    />
                                </div>
                                <div className="flex-1 sm:flex-[0.4] space-y-2">
                                    <Label htmlFor="radius">
                                        Location Radius (km)
                                    </Label>
                                    <Input
                                        id="radius"
                                        type="number"
                                        step="1"
                                        placeholder="Input radius"
                                        {...form.register("radius", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {form.formState.errors.radius && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.radius
                                                    .message
                                            }
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Define the maximum distance you can
                                        operate within.
                                    </p>
                                </div>
                            </div>

                            {watch("location")?.coordinates.length === 2 &&
                                watch("radius") >= 1 && (
                                    <div className="h-64 w-full">
                                        <Map
                                            {...{
                                                name: watch("location")?.name,
                                                lat: watch("location")
                                                    ?.coordinates[1],
                                                lng: watch("location")
                                                    ?.coordinates[0],
                                                serviceRadius: watch("radius"),
                                            }}
                                        />
                                    </div>
                                )}

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    About Your Business (optional)
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Share what makes your business special, your story, services offered..."
                                    rows={5}
                                    {...form.register("description")}
                                />
                                {form.formState.errors.description && (
                                    <p className="text-sm text-destructive">
                                        {
                                            form.formState.errors.description
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-4">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">
                                    Media Gallery
                                </CardTitle>
                                <CardDescription>
                                    Upload images and videos to showcase your
                                    business (optional)
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <label
                                htmlFor="media-upload"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-muted border-border"
                            >
                                <div className="flex gap-2 mb-2">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    <Video className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <span className="font-medium text-sm">
                                    Add photos & videos
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    PNG, JPG, WEBP, MP4, WEBM or MOV
                                </span>
                            </label>
                            <input
                                id="media-upload"
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={(e) =>
                                    handleMediaSelect(
                                        Array.from(e.target.files || [])
                                    )
                                }
                                className="sr-only"
                            />

                            {watch("media")?.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {watch("media")?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="relative w-full h-32 border border-border rounded-lg overflow-hidden"
                                        >
                                            {item.type === "image" ? (
                                                <img
                                                    src={item.url}
                                                    alt={`Media ${index + 1}`}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <video
                                                    src={item.url}
                                                    className="w-full h-full object-contain"
                                                    controls
                                                />
                                            )}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() =>
                                                    removeMedia(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="sticky bottom-0 z-50 flex gap-4 pb-4 pt-4 bg-background border-t mx-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={handleSkip}
                        >
                            <span>Skip</span>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 gap-2"
                            disabled={isPending}
                        >
                            <span>Create Business</span>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { CreateNewBusinessForm };