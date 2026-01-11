import { cn } from "@/lib/utils";
import { Product } from "@/types/shopify";
import { Link } from "@tanstack/react-router";
import { ComponentProps } from "react";

export type ProductType = Product;

interface ProductCardProps extends ComponentProps<"a"> {
    product: Product;
}

export default function ProductCard(
    { product, className, ...props }: ProductCardProps
) {
    const
        { handle, title, priceRange, featuredImage } = product;

    return (
        <Link to="/products/$handle" params={{ handle }} className={cn("flex flex-col items-center gap-3 max-w-146", className)} {...props}>
            <div className="h-full w-full aspect-3/4 border bg-foreground/5">
                {featuredImage && <img className="object-cover h-full w-full -m-.5" src={featuredImage.url} alt={featuredImage.altText} />}
            </div>
            <div className="flex flex-col sm:items-center group w-full">
                <p className="uppercase sm:text-center leading-tight group-hover:opacity-100 opacity-45 transition-all line-clamp-1">{title}</p>
                <p className="uppercase sm:text-center leading-tight group-hover:opacity-100 opacity-45 transition-all">
                    {priceRange.minVariantPrice.amount} {priceRange.minVariantPrice.currencyCode}
                </p>
            </div>
        </Link>
    )
}