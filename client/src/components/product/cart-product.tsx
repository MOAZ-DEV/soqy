import { ComponentProps } from "react";
import { Minus, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ProductType } from "./product-card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface CartProduct extends ComponentProps<'div'> {
    product: ProductType;
    amount?: number;
    onChange: (n: any) => void;
}

export default function CartProduct(
    { product, amount = 0, onChange, className, ...props }: CartProduct
) {
    const
        { id, title, images, price } = product,
        displayedPrice = (typeof price === "string") ? price : price.default;

    const
        AmountControler = () => <div className="flex flex-row gap-3 mt-3">
            <Button variant="secondary" size="sm" className="size-6 hover:bg-foreground/5 cursor-pointer" disabled={amount < 0}><Minus className="size-3" /></Button>
            <span className={cn("", (amount < 0) ? "opacity-25" : "")}>{amount}</span>
            <Button variant="secondary" size="sm" className="size-6 hover:bg-foreground/5 cursor-pointer" disabled={amount > 50}><Plus className="size-3" /></Button>
        </div>

    return (
        <div className={cn(
            "flex flex-row gap-3", className
        )} {...props}>
            <img src={images[0].src} className="size-24 aspect-square object-cover border bg-background/25" />
            <div className="flex flex-col my-auto">
                <Link to={"/" + id} className="uppercase leading-tight group-hover:opacity-100 opacity-45 transition-all line-clamp-1">{title}</Link>
                <p className="uppercase leading-tight group-hover:opacity-100 opacity-45 transition-all">{displayedPrice}</p>
                <AmountControler />
            </div>
        </div>
    )
}
