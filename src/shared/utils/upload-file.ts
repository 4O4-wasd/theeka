import { cloudinarySign } from "@/shared/actions/cloudinary-sign";
import imageCompression from "browser-image-compression";
import { env } from "../";

export const uploadFile = async (
    file: File,
    id: string,
    uploadPath: string,
    maxWidthOrHeight: number = 128,
    maxSizeMB: number = 0.1
) => {
    try {
        const type = file.type.startsWith("video/") ? "video" : "image";

        const compressedFile =
            type === "image"
                ? await imageCompression(file, {
                      maxSizeMB,
                      maxWidthOrHeight,
                      useWebWorker: true,
                  })
                : file;
        const timestamp = Math.round(Date.now() / 1000);
        const {
            data: signature,
            serverError,
            validationErrors,
        } = await cloudinarySign({
            paramsToSign: { folder: uploadPath, timestamp, public_id: id },
        });

        if (validationErrors) {
            throw validationErrors;
        }

        if (serverError) {
            throw serverError;
        }

        if (!signature) {
            throw new Error("Signature is invalid");
        }

        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append("public_id", id);
        formData.append("folder", uploadPath);

        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const uploadData = await uploadResponse.json();
        return uploadData.secure_url as string;
    } catch (error) {
        console.error("Upload failed:", error);
    }
};
