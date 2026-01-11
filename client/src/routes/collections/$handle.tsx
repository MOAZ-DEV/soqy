import MainLayout from '@/components/main-layout';
import { createFileRoute } from '@tanstack/react-router';
import { useCollection } from '@/hooks/use-collection';

export const Route = createFileRoute('/collections/$handle')({
  component: ProductRoute,
});

function ProductRoute() {
  const { handle } = Route.useParams();
  const { data: collection, isLoading, error } = useCollection({ handle });

  if (isLoading) return <div>Loading...</div>;
  if (error || !collection) return <div>Collection not found</div>;

  return (
    <MainLayout>
      {collection.title}
    </MainLayout>
  );
}
