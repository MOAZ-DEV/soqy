"use client"

import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  customPoseBtns?: boolean;
  customeHeader?: React.ReactNode;
  setApi?: (api: CarouselApi) => void
  opts?: CarouselOptions
  autoPlay?: boolean
  autoPlayInterval?: number
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  customPoseBtns = false,
  customeHeader,
  opts,
  setApi,
  plugins,
  className,
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const autoplayPlugin = React.useMemo(
    () =>
      autoPlay
        ? Autoplay({
          delay: autoPlayInterval,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        })
        : null,
    [autoPlay, autoPlayInterval],
  )

  const allPlugins = React.useMemo(() => {
    const pluginArray = plugins ? (Array.isArray(plugins) ? plugins : [plugins]) : []
    return autoplayPlugin ? [...pluginArray, autoplayPlugin] : pluginArray
  }, [plugins, autoplayPlugin])

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
      loop: autoPlay ? true : opts?.loop, // Enable loop for autoplay
    },
    allPlugins,
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        autoPlay,
        autoPlayInterval,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative flex flex-col gap-2", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {customeHeader}
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} data-slot="carousel-content">
      <div className={cn("flex gap-2", orientation === "horizontal" ? "" : "-mt-4 flex-col", className)} {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  // const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full last:mr-2",
        // orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}

      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "secondary",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, customPoseBtns, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full bg-background/45 border backdrop-blur-sm",
        customPoseBtns ? ""
          : orientation === "horizontal"
            ? "top-1/2 left-4 -translate-y-1/2"
            : "top-4 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "secondary",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, customPoseBtns, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full bg-background/45 border backdrop-blur-sm",
        customPoseBtns ? ""
          : orientation === "horizontal"
            ? "top-1/2 right-4 -translate-y-1/2"
            : "bottom-4 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }