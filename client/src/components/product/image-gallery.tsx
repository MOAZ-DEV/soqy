import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { Product } from '@/types/shopify';

export default function ImageGallery({ product, mobile }: { product: Product; mobile?: boolean }) {
  const images = product.images?.edges ?? [];

  if (mobile) {
    return (
      <Carousel className="sm:hidden">
        <CarouselContent>
          {images.map(({ node }) => (
            <CarouselItem key={node.url}>
              <img src={node.url} alt={node.altText || 'Product image'} className="h-full w-full aspect-3.5/4 object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      {images.map(({ node }) => (
        <img key={node.url} src={node.url} alt={node.altText || 'Product image'} className="h-full w-full aspect-3.5/4 object-cover" />
      ))}
    </div>
  );
}
