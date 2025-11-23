import { getProfessional } from "@/features/professional/actions/get-professional";
import { database } from "@/shared/db";

const BusinessAdminPage = async ({
    params: p,
}: {
    params: Promise<{ id: string }>;
}) => {
    const bId = (await p).id;

    const professional = (await getProfessional()).data;

    if (!professional) {
        throw new Error("You are not a professional");
    }

    const business = await database.query.business.findFirst({
        where: ({ id, professionalId }, { sql }) =>
            sql`id = ${bId} AND ${professionalId} = ${professional.id}`,
    });

    return <div>{bId}</div>;
};

export default BusinessAdminPage;
