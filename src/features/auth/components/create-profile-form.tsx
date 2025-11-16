"use client";

import { authClient } from "@/features/auth/utils/auth-client";
import { CropArea, cropImage } from "@/features/auth/utils/crop-image";
import { TT } from "@/features/translation";
import { defaultUserSchema } from "@/shared/schemas";
import { uploadFile } from "@/shared/utils";
import {
    Button,
    Modal,
    Slider,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { IconArrowRight, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import Cropper from "react-easy-crop";
import z from "zod";

const CreateProfileForm = ({
    user,
}: {
    user: z.infer<typeof defaultUserSchema>;
}) => {
    const [name, setName] = useState(user.name);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isCreating, startCreateTransition] = useTransition();

    const router = useRouter();

    const onCropComplete = (
        croppedArea: CropArea,
        croppedAreaPixels: CropArea
    ) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isCreating) {
            return;
        }

        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setIsDialogOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            try {
                const croppedImage = await cropImage(
                    imageSrc,
                    croppedAreaPixels
                );
                setImageFile(croppedImage);
                setIsDialogOpen(false);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            } catch (e) {
                console.error("Error cropping image:", e);
            }
        }
    };

    const handleSubmit = () => {
        startCreateTransition(async () => {
            if (!imageFile) {
                await authClient.updateUser(
                    {
                        name,
                    },
                    {
                        onSuccess: () => router.replace("/select-role"),
                    }
                );
                return;
            }

            const imageSrc = await uploadFile(
                imageFile,
                crypto.randomUUID(),
                "theeke/user/avatar",
                128,
                0.1
            );

            await authClient.updateUser(
                {
                    name,
                    image: imageSrc,
                },
                {
                    onSuccess: () => router.replace("/select-role"),
                }
            );
        });
    };

    const imagePreview = imageFile
        ? URL.createObjectURL(imageFile)
        : user.image
        ? user.image
        : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md">
                <div className="space-y-1 mb-6">
                    <Title order={1} className="text-4xl font-bold text-center">
                        <TT>Create Profile</TT>
                    </Title>
                    <Text className="text-center text-base" c="dimmed">
                        <TT>Set up your profile to get started</TT>
                    </Text>
                </div>

                <Stack gap="xl">
                    <div className="flex flex-col items-center space-y-4">
                        <label
                            htmlFor="profile-image"
                            className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <IconUser
                                    size={64}
                                    className="text-muted-foreground"
                                />
                            )}
                            <input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isCreating}
                                className="hidden"
                            />
                        </label>
                        <Text size="sm" c="dimmed" ta="center">
                            <TT>Click to upload your profile picture</TT>{" "}
                            <strong>
                                (<TT>optional</TT>)
                            </strong>
                        </Text>
                    </div>

                    <TextInput
                        disabled={isCreating}
                        id="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        leftSection={<IconUser size={16} />}
                    />

                    <Button
                        onClick={handleSubmit}
                        fullWidth
                        disabled={isCreating}
                        rightSection={<IconArrowRight size={16} />}
                        justify="space-between"
                        className="!px-4"
                    >
                        Continue
                    </Button>
                </Stack>
            </div>

            <Modal
                opened={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Crop Profile Picture"
                centered
                size="md"
            >
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Adjust the image to fit your profile
                    </Text>

                    <div className="relative h-64 w-full bg-muted rounded-lg overflow-hidden">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>

                    <div>
                        <Text size="sm" fw={500} mb="xs">
                            Zoom
                        </Text>
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={setZoom}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="default"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCropSave}>Save</Button>
                    </div>
                </Stack>
            </Modal>
        </div>
    );
};

export { CreateProfileForm };
