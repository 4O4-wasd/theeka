export type CropArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

export const cropImage = async (
    imageSrc: string,
    pixelCrop: CropArea,
    outputSize = 128
): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    canvas.width = outputSize;
    canvas.height = outputSize;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        outputSize,
        outputSize
    );

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], crypto.randomUUID(), {
                    type: "image/jpeg",
                });
                resolve(file);
            },
            "image/jpeg",
            0.95
        );
    });
};
