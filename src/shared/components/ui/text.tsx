import { TT } from "@/features/translation";
import { cn } from "@/shared/utils";
import { cva, VariantProps } from "class-variance-authority";

export const textVariants = cva("", {
    variants: {
        variant: {
            h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
            h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
            h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
            h4: "scroll-m-20 text-xl font-semibold tracking-tight",
            p: "",
            blockquote: "mt-6 border-l-2 pl-6 italic",
            lead: "text-xl text-muted-foreground",
            large: "text-lg font-semibold",
            small: "text-sm font-medium leading-none",
            muted: "text-sm text-muted-foreground",
            code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        },
        font: {
            default: "font-sans",
            mono: "font-mono",
        },
    },
    defaultVariants: {
        variant: "p",
        font: "default",
    },
});

const Text = ({
    variant = "p",
    children,
    font,
    className,
    noTranslate,
}: Omit<React.ComponentProps<"p">, "children"> &
    VariantProps<typeof textVariants> & {
        noTranslate?: boolean;
        children: string | (string | number)[];
    }) => {
    const Component =
        variant === "large" ||
        variant === "small" ||
        variant === "lead" ||
        variant === "muted"
            ? "p"
            : variant ?? "p";

    return (
        <Component className={cn(textVariants({ variant, font, className }))}>
            {!noTranslate ? (
                <TT>
                    {typeof children === "string"
                        ? children
                        : children.join("")}
                </TT>
            ) : typeof children === "string" ? (
                children
            ) : (
                children.join("")
            )}
        </Component>
    );
};

export default Text;
