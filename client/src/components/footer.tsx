import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ComponentProps } from "react";

interface FooterProps extends ComponentProps<'footer'> { }

export default function Footer(
    { className, ...props }: FooterProps
) {

    const
        BottomBar = () => <div className="flex w-full border-t">
            <div className="flex flex-row items-center justify-between max-w-445 w-full mx-auto py-6 px-3 *:not-hover:opacity-45 *:transition leading-tight">
                <p>© 2024 SOQY-STORE. ALL RIGHTS RESERVED.</p>
                <p className="text-right">BUILT BY MOAAZ ALLA ELDEN.</p>
            </div>
        </div>,
        SiteMap = () => <div className="flex w-full border-t">
            <div className="flex flex-wrap sm:flex-row gap-x-12 sm:gap-22 max-w-445 w-full mx-auto py-6 px-2">
                <div className="flex flex-col p-2">
                    <span className="text-primary/45">DOC's</span>
                    <ul className="text-primary *:hover:underline *:not-hover:opacity-75 *:transition">
                        <Link to="/"><li>RETURN POLICY</li></Link>
                        <Link to="/"><li>PRIVACY POLICY</li></Link>
                    </ul>
                </div>
                <div className="flex flex-col p-2">
                    <span className="text-primary/45">COLLECTIONS</span>
                    <ul className="text-primary *:hover:underline *:not-hover:opacity-75 *:transition">
                        <Link to="/"><li>SUMMER 25</li></Link>
                        <Link to="/"><li>VINTAGE</li></Link>
                        <Link to="/"><li>SMART CASUAL</li></Link>
                    </ul>
                </div>
                <div className="flex flex-col p-2">
                    <span className="text-primary/45">CONNECT</span>
                    <ul className="text-primary *:hover:underline *:not-hover:opacity-75 *:transition">
                        <Link to="/"><li>INSTAGRAM</li></Link>
                        <Link to="/"><li>YOUTUBE</li></Link>
                    </ul>
                </div>
            </div>
        </div>;
    return (
        <footer className={cn(
            "flex flex-col w-screen", className
        )} {...props}>
            <SiteMap />
            <BottomBar />
        </footer>
    )
}