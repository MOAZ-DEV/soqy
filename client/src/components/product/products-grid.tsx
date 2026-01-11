/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import ProductCard from "./product-card";
import { ComponentProps } from "react";
import { PageInfo, Product } from "@/types/shopify";
import PaginationRow from "@/components/pagination-row";

export default function ProductsGrid(
    { products, pageInfo, cursors, className, ...props }: ComponentProps<'div'> & { products: Product[]; pageInfo: PageInfo; cursors: any }
) {
    const RenderProductsItems = () =>
        products?.map((p: Product) => <ProductCard key={p.id ?? p.handle ?? Math.random()} product={p} />)

    return (
        <div className={cn(
            "grid max-sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-x-3 gap-y-4 max-w-445 mx-auto w-full px-3 py-1",
            className
        )} {...props}>
            <RenderProductsItems />
            {pageInfo && (
                <div className="col-span-full w-full mt-4">
                    <PaginationRow
                        hasNextPage={pageInfo?.hasNextPage}
                        hasPreviousPage={pageInfo?.hasPreviousPage}
                        endCursor={cursors?.endCursor}
                        startCursor={cursors?.startCursor}
                    />
                </div>
            )}
        </div>
    )
}