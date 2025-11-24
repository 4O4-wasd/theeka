import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

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
                className="border-0 p-0 rounded-none max-w-screen! z-[9999] h-screen"
                showCloseButton={false}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Image preview</DialogTitle>
                </DialogHeader>
                <img src={src} className="object-contain z-10 h-full m-auto" />
                <Button
                    className="absolute top-4 right-4 rounded-full"
                    variant="outline"
                    size="icon-lg"
                >
                    <X className="size-5" />
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ExpandableImage;
