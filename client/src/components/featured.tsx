import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

type ctaBtnType = {
    title: string;
    url: string;
    varient?: "default" | "outline" | "secondary"
}
export type slidesType = {
    id: string;
    title: string;
    imageSrc: string;
    ctaBtns: ctaBtnType[]
}
interface FeaturedProps extends ComponentProps<'div'> {
    slides: slidesType[]
}

export default function Featured(
    { slides, className, ...props }: FeaturedProps
) {
    const
        RenderItems = () => slides.map(({ id, title, imageSrc, ctaBtns }) => (
            <CarouselItem key={id}>
                <div className="flex h-full w-full overflow-hidden relative group">
                    <div className="aspect-square sm:aspect-16/7 flex-1 relative">
                        <img src={imageSrc} alt={title} className="object-cover h-full w-full border bg-foreground/5" />
                        <span className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t bg-black/12 from-background/45 to-background/0 group-hover:backdrop-blur-none sm:backdrop-blur-md transition duration-700"></span>
                    </div>
                    <div className="flex flex-col sm:items-center justify-end sm:justify-center gap-3 sm:gap-6 absolute bottom-0 left-0 h-full w-full p-4">
                        <h2 className="text-4xl sm:text-6xl sm:text-center text-white font-semibold">{title}</h2>
                        <div className="flex flex-row items-center gap-2">
                            <RenderBtns {...{ ctaBtns }} />
                        </div>
                    </div>
                </div>
            </CarouselItem>
        )),
        RenderBtns = ({ ctaBtns }: { ctaBtns: ctaBtnType[] }) => ctaBtns.map(({ title, url, varient = "default" }, idx) => (
            <Button key={idx} variant={varient} size="sm" asChild>
                <Link to={url}>{title}</Link>
            </Button>
        ));

    return (
        <div className={cn(
            "flex w-full max-w-445 mx-auto px-3 py-1", className
        )} {...props}>
            <Carousel className="w-full" opts={{ align: "start", loop: true, duration: 30, inViewThreshold: .25 }} autoPlay >
                <CarouselContent>
                    <RenderItems />
                </CarouselContent>
                <CarouselNext />
                <CarouselPrevious />
            </Carousel>
        </div>
    )
}