import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import ProductCard, { ProductType } from "./product-card";

interface ProductsGridProps extends ComponentProps<'div'> {
    products: ProductType[];
}

export default function ProductsGrid(
    { products, className, ...props }: ProductsGridProps
) {
    const RenderProductsItems = () => products.map((data, idx) =>
        <ProductCard key={idx} {...{ product: data }} />
    )

    return (
        <div className={cn(
            "grid max-sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-x-3 gap-y-4 max-w-445 mx-auto w-full px-3 py-1",
            className
        )} {...props}>
            <RenderProductsItems />
        </div>
    )
}