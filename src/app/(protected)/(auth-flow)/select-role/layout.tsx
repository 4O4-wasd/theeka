import { getProfessional } from "@/features/professional/actions/get-professional";
import { redirect } from "next/navigation";
import React from "react";

const SelectRoleLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const professional = (await getProfessional()).data;
    if (professional) {
        redirect("/");
    }
    return children;
};

export default SelectRoleLayout;
