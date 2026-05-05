import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import Navbar from "./navbar";
import Footer from "./footer";

type MainLayoutProps = ComponentProps<"main">;

export default function MainLayout({
  className,
  children,
  ...props
}: MainLayoutProps) {
  return (
      <div className="">
        <main
          className={cn(
            "flex flex-col items-center gap-0 h-screen w-screen overflow-y-auto overflow-x-hidden text-primary bg-background",
            className,
          )}
          {...props}
        >
        <Navbar />
          {children}
        <Footer />
        </main>
      </div>
  );
}
