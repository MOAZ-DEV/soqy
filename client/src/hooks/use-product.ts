import { useQuery } from '@tanstack/react-query';
import type { FilterParams, PageInfo, PaginationParams, Product, SortParams } from '@/types/shopify';

const API_URL = 'https://soqy.moaz-dev.workers.dev/api';

const QUERY_KEYS = {
  PRODUCT: (handle?: string) => ['product', handle] as const,
  PRODUCTS: (params?: PaginationParams & SortParams & FilterParams) => ['products', params] as const,
};

async function fetchProduct(handle: string): Promise<Product> {
  const res = await fetch(`${API_URL}/product/${handle}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const { product } = await res.json();
  return product as Product;
}

export default function useProduct({ handle }: { handle?: string }) {
  const { data: product, isLoading, isFetching, error } = useQuery({
    queryKey: QUERY_KEYS.PRODUCT(handle),
    queryFn: () => fetchProduct(handle as string),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });

  return {
    product,
    isLoading: isLoading || isFetching,
    error,
  } as const;
}

// Fetch multiple products with optional search/sort and cursor-based pagination
export function useProducts(params?: PaginationParams & SortParams & FilterParams) {
  return useQuery<{
    success: boolean;
    products: Product[];
    pageInfo: PageInfo;
    cursors: {
      startCursor: string | undefined;
      endCursor: string | undefined;
    };
  }>({
    queryKey: QUERY_KEYS.PRODUCTS(params),
    queryFn: async () => {
      const search = new URLSearchParams();

      const res = await fetch(`${API_URL}/products?${search.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params })
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    staleTime: 1000 * 30,
  });
}
