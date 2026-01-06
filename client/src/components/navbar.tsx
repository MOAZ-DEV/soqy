"use client"
import { ComponentProps, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowRight, Plus, X, } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { DUMMY_PRODUCTS } from "@/shared/dummy-products";
import CartProduct from "./product/cart-product";

interface NavbarProps extends ComponentProps<'nav'> { };

export default function Navbar({
    className, ...props
}: NavbarProps) {
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

    const
        BagCart = () => <Sheet open>
            <SheetTrigger asChild>
                <Button variant="link" className="gap-1 cursor-pointer not-hover:opacity-75 transition">BAG</Button>
            </SheetTrigger>
            <SheetContent className="gap-0 z-5000 pointer-events-auto" side="bottom">
                <SheetHeader>
                    <SheetTitle className="text-sm">YOUR BAG</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col sm:flex-row gap-2 h-full w-full overflow-hidden px-2 pb-2">
                    <CheckOut />
                    <CartContent />
                </div>
                {/* <SheetFooter className="flex-row max-w-full">
                    <Button type="submit" className="w-auto">Save changes</Button>
                </SheetFooter> */}
            </SheetContent>
        </Sheet>,
        CartEmpty = () => (
            <div className="flex flex-col h-full w-full items-center justify-center gap-2">
                <p>YOUR CART IS EMPTY.</p>
                <SheetClose asChild>
                    <Button size="sm" asChild>
                        <Link to="/">
                            CONTINUE EXPLORING <ArrowRight />
                        </Link>
                    </Button>
                </SheetClose>
            </div>
        ),
        CartContent = () => (
            <div className="flex flex-col gap-2 h-full max-h-full w-full sm:max-w-90 p-2 border rounded-sm">
                <p className="text-sm opacity-45">ITEMS IN BAG</p>
                <div className="flex flex-col gap-1 w-full h-full overflow-y-scroll rounded-sm">
                    <RenderCartItems />
                </div>
            </div>
        ),
        CheckOut = () => (
            <div className="flex flex-col h-full w-full gap-2 p-2 overflow-y-auto bg-muted/45 border rounded-sm">
                <p className="text-sm opacity-45">CHECKOUT FORM</p>

            </div>
        ),
        RenderCartItems = () => DUMMY_PRODUCTS.length > 0 ? DUMMY_PRODUCTS.slice(0).map((product, idx) =>
            <CartProduct key={idx} product={product} onChange={() => { }} />
        ) : <CartEmpty />,
        StoreMenu = ({ className }: ComponentProps<'button'>) => <Button
            variant="link"
            className={cn("gap-1 cursor-pointer not-hover:opacity-75 transition", className)}
            onClick={() => setMenuIsOpen(!menuIsOpen)}
        >
            STORE (<Plus
                strokeWidth={1.5}
                className={cn("transition-all duration-700", menuIsOpen && "rotate-135")}
            />)
        </Button>,
        ActualMenu = () => <div className="flex flex-row max-h-fit w-full max-w-445 mx-auto px-2 py-6">
            <div className="flex flex-col gap-1">
                <span className="text-primary/25">COLLECTIONS</span>
                <ul className="text-primary *:hover:underline *:not-hover:opacity-45 *:transition">
                    <Link to="/"><li>SUMMER 25</li></Link>
                    <Link to="/"><li>VINTAGE</li></Link>
                    <Link to="/"><li>SMART CASUAL</li></Link>
                </ul>
            </div>
        </div>;

    return (
        <nav className={cn(
            "flex flex-col items-center max-h-15 w-full border-b p-3 sticky top-0 bg-background/24 backdrop-blur-sm z-50 overflow-hidden transition-all duration-300",
            { "max-h-96": menuIsOpen }, className
        )} {...props}>
            <div className="flex flex-row max-w-445 items-center justify-between w-full mx-auto">
                <div className="flex flex-row *:p-2 max-sm:hidden">
                    <Button variant="link" className="not-hover:opacity-75 transition" asChild><Link to="/">HOME</Link></Button>
                    <StoreMenu />
                </div>
                <Link to="/" className="text-primary px-2 opacity-75 sm:absolute sm:left-1/2 sm:-translate-x-1/2">SOQY STORE</Link>
                <div className="flex flex-row *:p-2">
                    <Button variant="link" className="max-sm:hidden not-hover:opacity-75 transition" asChild>
                        <Link to="/login">LOGIN</Link>
                    </Button>
                    <StoreMenu className="sm:hidden" />
                    <BagCart />
                </div>
            </div>
            <ActualMenu />
        </nav>
    )
}

