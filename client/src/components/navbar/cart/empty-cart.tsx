import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function CartEmpty() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2 mx-auto">
      <p>YOUR CART IS EMPTY.</p>
      <SheetClose asChild>
        <Button size="sm" asChild>
          <Link to="/">
            CONTINUE EXPLORING <ArrowRight />
          </Link>
        </Button>
      </SheetClose>
    </div>
  );
}
