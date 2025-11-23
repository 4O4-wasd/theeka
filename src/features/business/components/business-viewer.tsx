"use client";

import { TT } from "@/features/translation";
import ExpandableImage from "@/shared/components/expandable-image";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { Separator } from "@/shared/components/ui/separator";
import Text from "@/shared/components/ui/text";
import contractorCategories from "@/shared/constants/contractors";
import {
    IconBrandWhatsapp,
    IconClock,
    IconMapPin,
    IconPhone,
    IconShare,
} from "@tabler/icons-react";
import { Phone, Star } from "lucide-react";
import { BusinessSchemaType } from "../schema/business-schema";
import { Map } from "./map";

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

    const avgRating =
        business.totalRating && business.totalReviews
            ? (business.totalRating / business.totalReviews)
                  .toFixed(1)
                  .replace(".0", "")
            : null;

    const services = Object.entries(contractorCategories)
        .flatMap(([categoryName, category]) =>
            category.contractors.map((contractor) =>
                business.categoryNames.includes(contractor.name)
                    ? {
                          ...contractor,
                          category: categoryName,
                          categoryColor: category.color,
                          categoryBgColor: category.bgColor,
                      }
                    : undefined
            )
        )
        .filter((i) => !!i);

    console.log(services);

    return (
        <div className="max-w-7xl mx-auto flex flex-col">
            <Carousel className="w-full relative">
                <div className="overflow-hidden">
                    <CarouselContent>
                        {[...Array(business.media.length + 1).keys()].map(
                            (i) => {
                                const media =
                                    i === 0 ? null : business.media[i];

                                return (
                                    <CarouselItem className="aspect-video md:basis-1/2 pl-0 relative">
                                        {!media ? (
                                            <>
                                                <ExpandableImage
                                                    src={business.thumbnail}
                                                    className="object-cover bg-background w-full h-full z-10"
                                                />
                                            </>
                                        ) : media.type === "image" ? (
                                            <>
                                                <ExpandableImage
                                                    src={media.url}
                                                    className="object-cover bg-background w-full h-full z-10"
                                                />
                                            </>
                                        ) : (
                                            <video
                                                controls
                                                src={media.url}
                                                className="w-full h-full"
                                            />
                                        )}
                                    </CarouselItem>
                                );
                            }
                        )}
                    </CarouselContent>
                </div>
                <CarouselPrevious className="absolute top-0 bottom-0 my-auto left-7" />
                <CarouselNext className="absolute top-0 bottom-0 my-auto right-7" />
            </Carousel>

            <div className="border-t-2" />
            <div className="px-4">
                <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-8 space-y-6 md:border-r md:pr-3 pt-3.5 md:pb-20">
                        <div className="gap-2 flex flex-col">
                            <div className="flex justify-between items-center">
                                <div className="flex items-start">
                                    <Text
                                        noTranslate
                                        variant="h3"
                                        className="group-hover:underline line-clamp-1"
                                    >
                                        {business.title}
                                    </Text>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <div className="flex items-center gap-3 shrink-0">
                                        {avgRating ? (
                                            <>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium">
                                                        {avgRating}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        / 5
                                                    </span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    ({business.totalReviews}{" "}
                                                    reviews)
                                                </span>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm text-muted-foreground font-medium">
                                                    N / A
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleShare}
                                    >
                                        <IconShare size={20} />
                                    </Button>
                                </div>
                            </div>

                            <p className="text-muted-foreground">
                                {business.description ||
                                    "No description provided"}
                            </p>

                            <div className="border-t pt-3 mt-1 flex gap-1.5 items-center">
                                <IconMapPin
                                    size={16}
                                    className="flex-shrink-0"
                                />
                                <div>
                                    <p className="font-medium text-sm">
                                        {business.location.name},{" "}
                                        {business.location.city},{" "}
                                        {business.location.state}{" "}
                                        {business.location.postcode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Services</h2>
                            <div className="grid grid-col sm:grid-cols-2 gap-4">
                                {services.map((contractor, idx) => (
                                    <Card
                                        className="h-full p-0 shadow-none"
                                        key={idx}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-3xl">
                                                        {contractor.icon}
                                                    </span>
                                                    <div className="flex flex-col gap-2 flex-1">
                                                        <Text className="font-semibold">
                                                            {contractor.name}
                                                        </Text>
                                                        <Badge
                                                            variant="secondary"
                                                            className="w-fit"
                                                        >
                                                            <Text>
                                                                {
                                                                    contractor.category
                                                                }
                                                            </Text>
                                                        </Badge>
                                                        <Text
                                                            variant="muted"
                                                            className="text-sm"
                                                        >
                                                            {
                                                                contractor.description
                                                            }
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Text variant="h4" className="mb-4">
                                Professional
                            </Text>
                            <div className="flex gap-4 items-start">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                        {business.professional.professionalName.charAt(
                                            0
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">
                                        {business.professional.professionalName}
                                    </p>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        {business.professional.bio || (
                                            <TT>No bio provided</TT>
                                        )}
                                    </p>
                                    <div className="flex gap-2 flex-wrap mt-3">
                                        {business.professional.phoneNumbers.map(
                                            (phone, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="text-sm"
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
                        </div>

                        {/* <div className="shadow-none p-0 border-0">
                            <h2 className="text-xl font-bold mb-4">
                                Customer Reviews
                            </h2>

                            <div className="bg-muted/50 mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                                    <div className="sm:col-span-4 flex flex-col items-center gap-2">
                                        <p className="text-5xl font-bold">
                                            {rating}
                                        </p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <IconStarFilled
                                                    key={star}
                                                    size={20}
                                                    color={
                                                        star <=
                                                        parseFloat(rating)
                                                            ? "gold"
                                                            : "hsl(var(--muted-foreground))"
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Based on {business.totalReviews}{" "}
                                            reviews
                                        </p>
                                    </div>
                                    <div className="sm:col-span-8 space-y-2">
                                        {ratingDistribution.map(
                                            ({
                                                rating: r,
                                                count,
                                                percentage,
                                            }) => (
                                                <div
                                                    key={r}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="flex items-center gap-1 min-w-[60px]">
                                                        <span className="text-sm font-medium">
                                                            {r}
                                                        </span>
                                                        <IconStarFilled
                                                            size={14}
                                                            color="gold"
                                                        />
                                                    </div>
                                                    <div className="flex-1 relative h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                                                        {count}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <Card key={review.id}>
                                        <CardContent className="p-4">
                                            <div className="flex gap-4 items-start">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {review.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    review.userName
                                                                }
                                                            </p>
                                                            <div className="flex gap-1 mt-1">
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
                                                                                    : "hsl(var(--muted-foreground))"
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {review.date.toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div> */}
                    </div>

                    <div className="md:col-span-4 space-y-6 md:border-l md:pl-3 pt-3.5">
                        <div>
                            <Text variant="h4" className="mb-4">
                                Get in Touch
                            </Text>

                            <div className="gap-2 flex flex-col">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-base font-medium"
                                    onClick={() => console.log("child")}
                                >
                                    <Phone className="size-5 text-foreground" />
                                    {business.professional.phoneNumbers
                                        .length === 1
                                        ? business.professional.phoneNumbers[0]
                                        : "Call number"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-base font-medium"
                                    onClick={() => console.log("child")}
                                >
                                    <IconBrandWhatsapp className="size-6 text-teal-500" />
                                    WhatsApp
                                </Button>
                            </div>

                            <Separator className="my-6" />

                            <div>
                                <Text className="font-semibold mb-3">
                                    Contact Numbers
                                </Text>
                                <div className="space-y-2">
                                    {business.professional.phoneNumbers.map(
                                        (phone, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2"
                                            >
                                                <IconPhone size={16} />

                                                <a
                                                    href={`tel:+91${phone}`}
                                                    className="text-muted-foreground hover:underline"
                                                >
                                                    +91 {phone}
                                                </a>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div>
                                <Text className="font-semibold mb-3">
                                    Business Hours
                                </Text>
                                <div className="flex gap-2 items-start">
                                    <IconClock size={16} className="mt-0.5" />
                                    <div>
                                        <Text variant="small">
                                            Available 24/7
                                        </Text>
                                        <Text
                                            variant="muted"
                                            className="text-xs"
                                        >
                                            Emergency services available
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Text variant="h4" className="mb-4">
                                Service Area
                            </Text>
                            <div>
                                <div className="h-[200px] bg-muted-foreground/10 rounded-md flex items-center justify-center">
                                    <Map
                                        hideZoomInOut
                                        {...{
                                            lat: business.location
                                                .coordinates[1],
                                            lng: business.location
                                                .coordinates[0],
                                            serviceRadius: business.radius,
                                            name: business.location.name,
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground px-1 pt-2">
                                    Serving {business.location.name} and
                                    surrounding areas within {business.radius}{" "}
                                    km radius
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { BusinessViewer };
