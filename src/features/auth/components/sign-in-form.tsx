"use client";

import { authClient } from "@/features/auth/utils/auth-client";
import { TS, TT } from "@/features/translation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    IconArrowRight,
    IconBrandFacebook,
    IconLock,
    IconMail,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
    const [isLoggingIn, startLoginTransition] = useTransition();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleEmailSignIn = (values: FormValues) => {
        if (isLoggingIn) return;

        startLoginTransition(async () => {
            const signInResponse = await authClient.signIn.email(
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    onSuccess: () => {
                        router.push("/create-profile");
                    },
                }
            );

            if (signInResponse.error) {
                try {
                    const signUpResponse = await authClient.signUp.email(
                        {
                            email: values.email,
                            password: values.password,
                            name: "",
                        },
                        {
                            onSuccess: () => {
                                router.push("/create-profile");
                            },
                        }
                    );

                    if (signUpResponse.error) {
                        toast.error(
                            "There was something wrong when you tried to sign up"
                        );
                        return;
                    }
                } catch (signUpError) {
                    toast.error(
                        "There was something wrong when you tried to sign up"
                    );
                }
            }
        });
    };

    const handleGoogleAuth = () => {
        if (isLoggingIn) return;

        try {
            startLoginTransition(async () => {
                await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/create-profile",
                });
            });
        } catch {
            toast.error(
                "There was something wrong when you are trying to login"
            );
        }
    };

    const handleFacebookAuth = () => {
        if (isLoggingIn) return;

        try {
            startLoginTransition(async () => {
                await authClient.signIn.social({
                    provider: "facebook",
                    callbackURL: "/create-profile",
                });
            });
        } catch {
            toast.error(
                "There was something wrong when you are trying to login"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md">
                <div className="space-y-1 mb-6">
                    <h1 className="text-4xl font-bold text-center">
                        <TT>Welcome</TT>
                    </h1>
                    <p className="text-center text-base text-muted-foreground">
                        <TT>Sign in to your account or create a new one</TT>
                    </p>
                </div>

                <div className="space-y-3 mb-4">
                    <Button
                        variant="outline"
                        onClick={handleGoogleAuth}
                        disabled={isLoggingIn}
                        className="w-full justify-between"
                    >
                        <svg className="h-4 w-4 mr-2.5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <TT>Continue with Google</TT>
                        <IconArrowRight size={16} />
                    </Button>

                    <Button
                        onClick={handleFacebookAuth}
                        disabled={isLoggingIn}
                        className="w-full justify-between bg-blue-600 hover:bg-blue-700"
                    >
                        <IconBrandFacebook size={16} className="mr-2.5" />
                        <TT>Continue with Facebook</TT>
                        <IconArrowRight size={16} />
                    </Button>
                </div>

                <div className="relative my-6">
                    <Separator />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                        <p className="text-sm uppercase font-medium text-muted-foreground">
                            <TT>Or</TT>
                        </p>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(handleEmailSignIn)}>
                    <div className="space-y-3">
                        <TS string="Email">
                            {(placeholder) => (
                                <div className="relative">
                                    <IconMail
                                        size={16}
                                        className="absolute left-3 top-3 text-muted-foreground"
                                    />
                                    <Input
                                        id="email"
                                        placeholder={placeholder}
                                        disabled={isLoggingIn}
                                        className="pl-9"
                                        {...form.register("email")}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-sm text-destructive mt-1">
                                            {
                                                form.formState.errors.email
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            )}
                        </TS>
                        <TS string="Password">
                            {(placeholder) => (
                                <div className="relative">
                                    <IconLock
                                        size={16}
                                        className="absolute left-3 top-3 text-muted-foreground"
                                    />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={placeholder}
                                        disabled={isLoggingIn}
                                        className="pl-9"
                                        {...form.register("password")}
                                    />
                                    {form.formState.errors.password && (
                                        <p className="text-sm text-destructive mt-1">
                                            {
                                                form.formState.errors.password
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            )}
                        </TS>

                        <Button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full justify-between"
                        >
                            <TT>Continue with Email & Password</TT>
                            <IconArrowRight size={16} />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { SignInForm };
