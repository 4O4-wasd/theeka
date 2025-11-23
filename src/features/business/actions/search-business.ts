"use server";

import { getSavedCity } from "@/app/(main)/search/save";
import { defaultActionClient } from "@/shared/action-clients/default-action-client";
import { database } from "@/shared/db";
import { cache } from "react";
import z from "zod";

const preparedQuery = (limit?: number) =>
    database.query.business
        .findMany({
            with: {
                professional: {
                    columns: {
                        createdAt: false,
                    },
                },
            },
            where: (
                { categoryNames, title, description, radius },
                { sql, and, or }
            ) =>
                and(
                    sql`
                (
                    6371 * 2 * ASIN(SQRT(
                        POWER(SIN((RADIANS(${sql.placeholder(
                            "lat"
                        )}) - RADIANS(json_extract(location, '$.coordinates[1]'))) / 2), 2) +
                        COS(RADIANS(json_extract(location, '$.coordinates[1]'))) * COS(RADIANS(${sql.placeholder(
                            "lat"
                        )})) *
                        POWER(SIN((RADIANS(${sql.placeholder(
                            "lng"
                        )}) - RADIANS(json_extract(location, '$.coordinates[0]'))) / 2), 2)
                    )) <= ${radius}
                )
            `,
                    sql`
                (
                    lower(${title}) LIKE lower(${sql.placeholder("searchTerm")})
                    OR lower(${description}) LIKE lower(${sql.placeholder(
                        "searchTerm"
                    )})
                    OR lower(json_extract(${categoryNames}, '$')) LIKE lower(${sql.placeholder(
                        "searchTerm"
                    )})
                )
            `
                ),
            limit,
        })
        .prepare();

export const searchBusiness = cache(
    defaultActionClient
        .inputSchema(
            z.object({
                searchTerm: z.string(),
                limit: z.number().optional(),
            })
        )
        .action(async ({ parsedInput: { searchTerm, limit } }) => {
            const city = await getSavedCity();

            if (!city) {
                throw new Error("City is not set");
            }

            const [lng, lat] = city.coordinates;

            const businesses = await preparedQuery(limit).execute({
                lat,
                lng,
                searchTerm: `%${searchTerm}%`,
            });

            return businesses;
        })
);
