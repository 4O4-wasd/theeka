import { BusinessViewer } from "@/features/business/components/business-viewer";
import { database } from "@/shared/db";

const BusinessPage = async ({
    params: p,
}: {
    params: Promise<{ id: string }>;
}) => {
    const id = (await p).id;
    const business = await database.query.business.findFirst({
        with: {
            professional: true,
        },
        where: ({}, { sql }) => sql`id = ${id}`,
    });
    if (!business) {
        return;
    }

    return <BusinessViewer business={business} />;
};

export default BusinessPage;
