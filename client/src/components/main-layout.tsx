import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import Navbar from "./navbar";
import Footer from "./footer";
import LenisProvider from "./lenis-provider";

interface MainLayoutProps extends ComponentProps<'main'> { };

export default function MainLayout({
    className, children, ...props
}: MainLayoutProps) {

    return (
        <main className={cn(
            "flex flex-col items-center gap-3 min-h-screen w-screen max-w-screen dark text-primary bg-background overflow-x-hdden",
            className
        )}{...props}>
            <Navbar />
            <LenisProvider >
                {children}
            </LenisProvider>
            <Footer />
        </main>
    )
}