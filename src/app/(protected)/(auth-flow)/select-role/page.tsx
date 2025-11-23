"use client";

import { TT } from "@/features/translation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import { IconArrowRight, IconTie } from "@tabler/icons-react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState<"business" | "customer" | null>(null);
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
        <div className="container max-w-md h-dvh flex items-center justify-center">
            <Card className="w-full">
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-center mb-2">
                            <TT>Choose Your Role</TT>
                        </h1>
                        <p className="text-center text-muted-foreground text-sm">
                            <TT>Select how you want to use the platform</TT>
                        </p>
                    </div>

                    <div className="space-y-3 mt-6">
                        <button
                            onClick={() => handleRoleSelect("business")}
                            className={cn(
                                "p-4 border-2 rounded-lg transition w-full",
                                selectedRole === "business"
                                    ? "border-primary"
                                    : "border-border"
                            )}
                        >
                            <div className="flex gap-3 items-center">
                                <div
                                    className={cn(
                                        "p-2 rounded-full flex items-center justify-center",
                                        selectedRole === "business"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <IconTie size={20} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold text-sm">
                                        <TT>Professional</TT>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        <TT>
                                            Offer your services and find
                                            customers
                                        </TT>
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleRoleSelect("customer")}
                            className={cn(
                                "p-4 border-2 rounded-lg transition w-full",
                                selectedRole === "customer"
                                    ? "border-primary"
                                    : "border-border"
                            )}
                        >
                            <div className="flex gap-3 items-center">
                                <div
                                    className={cn(
                                        "p-2 rounded-full flex items-center justify-center",
                                        selectedRole === "customer"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <User size={20} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold text-sm">
                                        <TT>Customer</TT>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        <TT>Find and hire Professionals</TT>
                                    </p>
                                </div>
                            </div>
                        </button>

                        <Button
                            onClick={handleContinue}
                            disabled={!selectedRole}
                            className="w-full justify-between"
                        >
                            <TT>Continue</TT>
                            <IconArrowRight size={16} />
                        </Button>
                        <div className="flex justify-center">
                            <p className="text-xs text-muted-foreground mt-1">
                                <TT>You can change the later</TT>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
