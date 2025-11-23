"use client";

import { TT } from "@/features/translation";
import { defaultUserSchema } from "@/shared/schemas";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Briefcase, Phone, Plus, X } from "lucide-react";
import { cn } from "@/shared";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import z from "zod";
import { createProfessionalProfile } from "../actions/create-professional-profile";
import {
    CreateProfessionalProfileFormValues,
    createProfessionalProfileSchema,
} from "../schema/create-professional";

const BecomeProfessionalForm = ({
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
        resolver: zodResolver(createProfessionalProfileSchema),
        defaultValues: {
            professionalName: user.name,
            phoneNumbers: [0],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        rules: {
            minLength: 1,
            maxLength: 5
        },
        name: "phoneNumbers" as never,
    });

    const addPhone = () => {
        append("");
    };

    const removePhone = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const handleSubmit = (values: CreateProfessionalProfileFormValues) => {
        execute(values);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-sm px-4 py-24">
                <Card className="border-0">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold">
                                <TT>Create Business Profile</TT>
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Set up your professional profile to connect with
                                customers
                            </p>
                        </div>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="professionalName">
                                        Professional Name
                                    </Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="professionalName"
                                            placeholder="Akash Singh"
                                            className="pl-10"
                                            disabled={isSubmitting}
                                            {...form.register(
                                                "professionalName"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-medium">
                                            Phone Number(s)
                                        </p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={addPhone}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-1">
                                        {fields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="relative flex-1">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="tel"
                                                        placeholder="1234567890"
                                                        maxLength={10}
                                                        className="pl-10"
                                                        disabled={isSubmitting}
                                                        {...form.register(
                                                            `phoneNumbers.${index}`
                                                        )}
                                                    />
                                                </div>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removePhone(index)
                                                        }
                                                        disabled={isSubmitting}
                                                    >
                                                        <X className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 justify-between gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span>Submitting...</span>
                                        ) : (
                                            <span>Continue</span>
                                        )}
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export { BecomeProfessionalForm };
