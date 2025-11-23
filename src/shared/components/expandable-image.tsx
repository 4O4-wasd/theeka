import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useState } from "react";

const ExpandableImage = ({
    src,
    className,
}: {
    src: string;
    className?: string;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <img src={src} className={className} />
            </DialogTrigger>
            <DialogContent
                className="border-0 p-0 rounded-none max-w-screen! h-screen"
                showCloseButton={false}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Image preview</DialogTitle>
                </DialogHeader>
                <img src={src} className="object-contain z-10 h-full m-auto" />
                <img
                    src={src}
                    className="h-full w-full mx-auto object-cover absolute left-0 right-0 brightness-[.4]"
                />
            </DialogContent>
        </Dialog>
    );
};

export default ExpandableImage;
