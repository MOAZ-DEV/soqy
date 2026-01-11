import { ComponentProps } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { CartLine } from "@/types/shopify";
import { Badge } from "../../ui/badge";

interface CartProduct extends ComponentProps<'div'> {
    cartline: CartLine;
    onQuantityChange: (n: number) => void;
    onRemove?: () => void;
}

export default function CartProduct(
    { cartline, onQuantityChange, onRemove, className, ...props }: CartProduct
) {
    const
        { id, cost, merchandise, quantity } = cartline,
        { product: { handle, title, featuredImage }, selectedOptions } = merchandise;
    const
        AmountController = () => <div className="flex flex-row items-center gap-2">
            <Button variant="secondary" size="sm" className="size-6 hover:bg-foreground/5 cursor-pointer" disabled={quantity < 0} onClick={() => { onQuantityChange(quantity - 1) }}><Minus className="size-3" /></Button>
            <span className={cn("px-2", (quantity < 0) ? "opacity-25" : "")}>{quantity}</span>
            <Button variant="secondary" size="sm" className="size-6 hover:bg-foreground/5 cursor-pointer" disabled={quantity > 50} onClick={() => { onQuantityChange(quantity + 1) }}><Plus className="size-3" /></Button>
        </div>,
        RenderSelectedOptions = () => (
            <div className="flex flex-wrap gap-1 mt-1">
                {selectedOptions.map(({ value }, idx) => (
                    <Badge key={idx} variant="outline">
                        {value}
                    </Badge>
                ))}
            </div>
        );
    return (
        <div id={id} className={cn(
            "flex flex-row gap-3 w-full", className
        )} {...props}>
            <img src={featuredImage?.url} alt={featuredImage?.altText} className="size-26 aspect-square object-cover border bg-background/25" />
            <div className="flex flex-col gap-1 my-auto w-full relative">
                <Button variant="outline" size="sm" className="absolute top-0 right-0 size-6 rounded-full not-hover:border hover:bg-destructive/5 hover:text-destructive cursor-pointer not-hover:opacity-45" onClick={() => { onRemove?.() }}><X className="size-3" /></Button>
                <RenderSelectedOptions />
                <Link to={"/" + handle} className="uppercase leading-tight group-hover:opacity-100 opacity-75 transition-all">
                    <p className="line-clamp-2">{title}</p>
                </Link>
                <div className="flex flex-row items-center justify-between">
                    <p className="transition-all font-bold">{Number(cost.totalAmount.amount).toLocaleString("en", {
                        currency: cost.totalAmount.currencyCode,
                        style: "currency",
                    })}</p>
                    <AmountController />
                </div>
            </div>
        </div>
    )
}
