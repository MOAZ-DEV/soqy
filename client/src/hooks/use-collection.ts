import { Collection, ProductSortKeys } from '@/types/shopify';
import { useQuery } from '@tanstack/react-query';

interface CollectionsResponse {
  success: boolean;
  collections: Collection[];
  error?: string;
}

type CollectionResponse = Collection;

// New response shape for the products endpoint
interface CollectionProductsResponse {
  success: boolean;
  collection: Collection; // Assumes Collection type includes a `products` array
  error?: string;
}

const API_URL = "http://localhost:3000";

export function useCollections() {
  return useQuery<CollectionsResponse>({
    queryKey: ['collections'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/collections`);
      if (!res.ok) throw new Error('Failed to fetch collections');
      return res.json();
    },
  });
}

export function useCollection({ handle }: { handle: string }) {
  return useQuery<CollectionResponse>({
    queryKey: ['collection', handle],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/collection/${handle}`);
      if (!res.ok) throw new Error('Failed to fetch collection');
      const { collection } = await res.json();
      return collection;
    },
  });
}

// NEW HOOK: fetches a collection's products with server-side sorting
export function useCollectionProducts({
  handle,
  sortkey,
}: {
  handle: string;
  sortkey: ProductSortKeys;
}) {
  return useQuery<Collection>({
    queryKey: ['collection-products', handle, sortkey],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/collection/${handle}/products/${sortkey}`
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch collection products');
      }
      const data: CollectionProductsResponse = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      return data.collection; // return the collection object (with products)
    },
    enabled: !!handle && !!sortkey, // only run when both parameters are provided
  });
}