import { getAllBusinesses } from "@/features/business/actions/get-all-businesses";
import { Business } from "@/features/business/components/business";
import { getProfessional } from "@/features/professional/actions/get-professional";
import { a } from "@/shared/action-clients/a";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { IconEdit, IconPhone, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

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
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-4">
                            <Avatar className="h-[120px] w-[120px] rounded-md">
                                <AvatarImage src={user.image ?? undefined} />
                                <AvatarFallback className="rounded-md">
                                    {professional.professionalName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">
                                    {professional.professionalName}
                                </h2>
                                <p className="text-muted-foreground">
                                    {user.email}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {professional.phoneNumbers?.map(
                                        (phone, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                            >
                                                <IconPhone
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {phone}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button>
                            <IconEdit size={16} className="mr-2" />
                            Edit Profile
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold mb-2">Bio</p>
                            <p className="text-muted-foreground">
                                {professional.bio || "No bio added yet"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-8" />

            <div>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">Your Businesses</h3>
                    <Link href="/create-new-business">
                        <Button>
                            <IconPlus size={16} className="mr-2" />
                            Add Business
                        </Button>
                    </Link>
                </div>

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
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-muted-foreground">
                                    No businesses yet. Create your first
                                    business to get started!
                                </p>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
