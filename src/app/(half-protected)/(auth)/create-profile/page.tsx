import { CreateProfileForm } from "@/features/auth/components/create-profile-form";
import { auth } from "@/features/auth/utils/auth";
import { getProfessional } from "@/features/professional/actions/get-professional";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const CreateProfilePage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.name !== "") {
        const professional = (await getProfessional()).data;
        if (professional) {
            redirect("/");
        }
        redirect("/select-role");
    }

    return <CreateProfileForm user={session.user} />;
};

export default CreateProfilePage;
