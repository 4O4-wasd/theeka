import { searchBusiness } from "@/features/business/actions/search-business";
import { Business } from "@/features/business/components/business";
import SearchInput from "@/features/explore/components/search-input";
import { Input } from "@/shared/components/ui/input";
import Text from "@/shared/components/ui/text";
import LocationInput from "../../location";
import { getSavedCity } from "../save";

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
                    <p className="text-xl font-bold">
                        Please select a location
                    </p>
                </div>
            </div>
        );
    }

    const [lng, lat] = city.coordinates;

    const businesses = (
        await searchBusiness({
            searchTerm,
            limit: 10,
        })
    ).data;

    return (
        <div className="flex flex-col gap-4 md:px-4">
            <div className="container max-w-7xl py-5">
                <div className="flex gap-1 mb-3">
                    <Text variant="h4" noTranslate>
                        Showing results for "{searchTerm}" in {city.name}
                    </Text>
                </div>

                <div className="flex gap-2 shrink-0 flex-col">
                    <SearchInput defaultValue={searchTerm} />
                    <LocationInput className="!flex-[0.4]" />
                </div>
            </div>

            <div className="space-y-6 pb-20">
                {businesses?.map((b) => (
                    <Business preview business={b} key={b.id} />
                ))}
            </div>
        </div>
    );
};

export default SearchIdPage;
