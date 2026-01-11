import MainLayout from '@/components/main-layout';
import ImageGallery from '@/components/product/image-gallery';
import { createFileRoute } from '@tanstack/react-router';
import useProduct from '@/hooks/use-product';
import { useCart } from '@/hooks/use-cart';
import ProductDetails from '@/components/product/product-details';

export const Route = createFileRoute('/products/$handle')({
  component: ProductRoute,
});

function ProductRoute() {
  const { handle } = Route.useParams();
  const { product, isLoading, error } = useProduct({ handle });

  const {
    addToCart,
    isAdding
  } = useCart();

  if (isLoading) return <div>Loading...</div>;
  if (error || !product) return <div>Product not found</div>;

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row w-full">
        <div className="w-1/2 max-sm:hidden">
          <ImageGallery product={product} />
        </div>

        <div className="sm:hidden w-full">
          <ImageGallery product={product} mobile />
        </div>

        <div className="flex flex-col items-center justify-center sm:h-screen sm:w-1/2 p-4 sm:sticky sm:top-15">
          <ProductDetails
            product={product}
            onAddToCart={(variantId) => addToCart({ variantId, quantity: 1 })}
            adding={isAdding}
          />
        </div>
      </div>
    </MainLayout>
  );
}
