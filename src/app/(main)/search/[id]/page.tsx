import { Business } from "@/features/business/components/business";
import { database } from "@/shared";
import { Input, Text } from "@mantine/core";
import LocationInput from "../../location";
import { getSavedCity } from "../save";
import SearchInput from "./search-input";

const preparedQuery = database.query.business
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
    })
    .prepare();

const SearchIdPage = async ({
    params: p,
}: {
    params: Promise<{ id: string }>;
}) => {
    const params = await p;
    const searchTerm = decodeURI(params.id);
    const city = await getSavedCity();

    if (!city) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 shrink-0 w-full">
                    <Input
                        placeholder="Search"
                        defaultValue={searchTerm}
                        className="flex-[.8]"
                    />
                    <LocationInput className="flex-[.2]" />
                </div>
                <div className="space-y-12 pb-20">
                    <Text fw={700} size="xl">
                        Please select a location
                    </Text>
                </div>
            </div>
        );
    }

    const [lng, lat] = city.coordinates;

    const businesses = await preparedQuery.execute({
        lat,
        lng,
        searchTerm: `%${searchTerm}%`,
    });

    console.log(businesses);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 shrink-0 w-full">
                <SearchInput defaultValue={searchTerm} />
                <LocationInput className="flex-[.2]" />
            </div>
            <div className="space-y-6 pb-20">
                {businesses.map((b) => (
                    <Business preview business={b} key={b.id} />
                ))}
            </div>
        </div>
    );
};

export default SearchIdPage;
