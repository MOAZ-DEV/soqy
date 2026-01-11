import { useQuery } from '@tanstack/react-query';

export interface Collection {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string;
  };
}

interface CollectionsResponse {
  success: boolean;
  collections: Collection[];
  error?: string;
}
type CollectionResponse = Collection

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
    queryKey: ['collection'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/collection/${handle}`);
      if (!res.ok) throw new Error('Failed to fetch collections');
      const { collection } = await res.json();
      return collection;
    },
  });
}


