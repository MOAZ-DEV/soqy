"use client";

import { ComponentProps, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import StoreMenu from "./store-menu";
import CollectionsMenu from "./navbar/collections-menu";
import BagCart from "./navbar/cart/big-cart";

type NavbarProps = ComponentProps<"nav">;

export default function Navbar({ className, ...props }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={cn(
        "flex flex-col items-center max-h-15 w-full border-b p-3 sticky top-0 bg-background/24 backdrop-blur-sm z-50 overflow-hidden transition-all duration-300",
        menuOpen && "max-h-96",
        className
      )}
      {...props}
    >
      <div className="flex flex-row max-w-445 items-center justify-between w-full mx-auto">
        <div className="flex flex-row *:p-2 max-sm:hidden">
          <Button variant="link" asChild>
            <Link to="/">HOME</Link>
          </Button>
          <StoreMenu open={menuOpen} onToggle={setMenuOpen} />
        </div>

        <Link
          to="/"
          className="text-primary px-2 opacity-75 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
        >
          SOQY STORE
        </Link>

        <div className="flex flex-row *:p-2">
          <StoreMenu open={menuOpen} onToggle={setMenuOpen} className="sm:hidden" />
          <BagCart />
        </div>
      </div>

      <CollectionsMenu />
    </nav>
  );
}
