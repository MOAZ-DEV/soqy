import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ComponentProps } from "react";

export type ProductType = {
    id: string;
    title: string;
    price: {
        default: string;
    };
    images: {
        src: string;
    }[];
};

interface ProductCardProps extends ComponentProps<"a"> {
    product: ProductType;
}

export default function ProductCard(
    { product, className, ...props }: ProductCardProps
) {
    const
        { id, title, price, images } = product,
        displayedPrice = (typeof price === "string") ? price : price.default;

    return (
        <Link id={id} to={"/" + id} className={cn("flex flex-col items-center gap-3 max-w-146", className)} {...props}>
            <div className="h-full w-full aspect-3/4 border bg-foreground/5">
                <img className="object-cover h-full w-full -m-.5" src={images[0].src} alt={title} />
            </div>
            <div className="flex flex-col sm:items-center group w-full">
                <p className="uppercase sm:text-center leading-tight group-hover:opacity-100 opacity-45 transition-all line-clamp-1">{title}</p>
                <p className="uppercase sm:text-center leading-tight group-hover:opacity-100 opacity-45 transition-all">{displayedPrice}</p>
            </div>
        </Link>
    )
}