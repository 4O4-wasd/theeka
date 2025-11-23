"use client";

import Link from "next/link";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

import { cn } from "@/shared";

import { MapPin, Phone, Star } from "lucide-react";

import Text from "@/shared/components/ui/text";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { BusinessSchemaType } from "../schema/business-schema";

type Props =
    | (
          | {
                preview: true;
                href?: string;
            }
          | {
                preview: false;
            }
      ) & {
          business: BusinessSchemaType;
      };

export function Business({ business, ...props }: Props) {
    const avgRating =
        business.totalRating && business.totalReviews
            ? (business.totalRating / business.totalReviews)
                  .toFixed(1)
                  .replace(".0", "")
            : null;

    return (
        <Card
            className={cn(
                "overflow-hidden transition-all p-0 shadow-none",
                props.preview && "group cursor-pointer"
            )}
        >
            <div className="flex flex-col sm:flex-row gap-6 p-3">
                <div className="relative aspect-video border justify-center items-center flex sm:aspect-auto sm:size-48 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                        src={business.thumbnail}
                        alt={business.title}
                        className="object-cover transition-transform"
                    />
                </div>

                <div className="flex flex-1 flex-col px-2 pb-2 sm:px-0 sm:pr-2 sm:pb-0 justify-center gap-5">
                    <Link
                        href={
                            props.preview
                                ? props.href ?? `/b/${business.id}`
                                : "#"
                        }
                        className={props.preview ? "" : "pointer-events-none"}
                    >
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between w-full flex-wrap">
                                <div className="flex items-start">
                                    <Text
                                        noTranslate
                                        variant="h3"
                                        className="group-hover:underline line-clamp-1"
                                    >
                                        {business.title}
                                    </Text>
                                </div>

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
                            </div>

                            <p className="text-muted-foreground line-clamp-2">
                                {business.description ||
                                    "No description provided"}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="line-clamp-1">
                                    Based in {business.location.name},{" "}
                                    {business.location.state} • Service range:{" "}
                                    {business.radius} km
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {business.categoryNames
                                    .slice(0, 3)
                                    .map((category, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            {category}
                                        </Badge>
                                    ))}
                            </div>
                        </div>
                    </Link>

                    <div className="flex gap-3 flex-wrap">
                        <Button
                            variant="outline"
                            onClick={() => console.log("child")}
                        >
                            <Phone className="size-4 text-foreground" />
                            {business.professional.phoneNumbers}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => console.log("child")}
                        >
                            <IconBrandWhatsapp className="size-5 text-teal-500" />
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
