import MainLayout from "@/components/main-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useCollection } from "@/hooks/use-collection";
import type { Collection } from "@/types/shopify";
import ProductsGrid from "@/components/product/products-grid";

export const Route = createFileRoute("/collections/$handle")({
  component: ProductRoute,
});

function ProductRoute() {
  const { handle } = Route.useParams();
  const { data: collection, isLoading, error } = useCollection({ handle });
  

  if (isLoading) return <div>Loading...</div>;
  if (error || !collection) return <div>Collection not found</div>;

  return (
    <MainLayout>
      <Banner {...collection} />
      <ProductsGrid
        products={collection.products.edges.map((e) => e.node)}
        // pageInfo={collection.products.pageInfo}
        // cursors={collection.products.pageInfo}
      />
    </MainLayout>
  
  );
}

const Banner = ({ image, title, description }: Collection) => (
  <div className="max-w-445 mx-auto w-full px-3 py-1 relative">
    <div className="relative h-full w-full aspect-video border rounded">
      <span className="absolute top-0 left-0 h-full w-full bg-linear-to-b from-background/0 to-background/90"></span>
      <img src={image?.url} alt="Banner" className="h-full w-full object-cover rounded" />
      
    </div>
    <div className="absolute bottom-0 p-6">
      <h2 className="text-9xl -m-2">{title}</h2>
      <p className="text-sm opacity-75 max-w-4xl">{description}</p>
    </div>
    
  </div>
);
