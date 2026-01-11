import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import Navbar from "./navbar";
import Footer from "./footer";
import LenisProvider from "./lenis-provider";

type MainLayoutProps = ComponentProps<'main'>;

export default function MainLayout({
    className, children, ...props
}: MainLayoutProps) {

    return (
        <main className={cn(
            "flex flex-col items-center gap-0 min-h-screen w-screen max-w-screen text-primary bg-background",
            className
        )}{...props}>
            <Navbar />
            <LenisProvider>
                {children}
            </LenisProvider>
            <Footer />
        </main>
    )
}