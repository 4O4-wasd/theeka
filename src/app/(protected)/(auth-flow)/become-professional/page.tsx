import { auth } from "@/features/auth/utils/auth";
import { BecomeProfessionalFrom } from "@/features/professional/components/become-professional-from";
import { headers } from "next/headers";

const BecomeProfessionalPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return null;
    }

    // const { data: professional } = await getProfessional();

    // if (professional) {
    //     redirect("/");
    // }

    return <BecomeProfessionalFrom user={session.user} />;
};

export default BecomeProfessionalPage;
