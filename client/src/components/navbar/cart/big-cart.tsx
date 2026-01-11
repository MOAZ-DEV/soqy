import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartContent from "./cart-content";
import { ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";

export default function BagCart() {
  const { cart } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link">BAG</Button>
      </SheetTrigger>

      <SheetContent className="h-full gap-0 overflow-hidden">
        <SheetHeader>
          <SheetTitle className="text-sm">YOUR BAG</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col sm:flex-row gap-2 h-full max-h-full px-2 pb-2 overflow-hidden">
          <CartContent />
        </div>

        <SheetFooter className="p-2" hidden={cart?.lines.edges.length === 0}>
          <Button asChild size="lg" className="cursor-pointer">
            <Link to={cart?.checkoutUrl}>
              <ShoppingBag /> CHECKOUT
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="cursor-pointer">
            CLEAR CART
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
