import { Cart } from "@/types/shopify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000";
const CART_KEY = "cart_id";

const QUERY_KEYS = {
  CART: ["cart"] as const,
};

let cachedCartId: string | null = null;

const getCartId = () => {
  if (cachedCartId) return cachedCartId;
  if (typeof window === "undefined") return null;
  cachedCartId = localStorage.getItem(CART_KEY);
  return cachedCartId;
};

const setCartId = (id: string) => {
  cachedCartId = id;
  localStorage.setItem(CART_KEY, id);
};

/* ================= API ================= */

const fetchCart = async (): Promise<Cart | null> => {
  const cartId = getCartId();
  if (!cartId) return null;

  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId }),
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  return (await res.json()).cart;
};

const addToCart = async ({
  variantId,
  quantity,
}: {
  variantId: string;
  quantity: number;
}): Promise<Cart> => {
  const cartId = getCartId();

  const res = await fetch(
    `${API_BASE_URL}/cart/${cartId ? "add" : "create"}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, variantId, quantity }),
    }
  );

  if (!res.ok) throw new Error("Failed to add to cart");

  const data = await res.json();
  if (!cartId) setCartId(data.cart.id);

  return data.cart;
};

const updateLine = async ({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}): Promise<Cart> => {
  const res = await fetch(`${API_BASE_URL}/cart/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId: getCartId(), lineId, quantity }),
  });

  if (!res.ok) throw new Error("Failed to update cart");
  return (await res.json()).cart;
};

const removeLine = async (linesId: string[]): Promise<Cart> => {
  const res = await fetch(`${API_BASE_URL}/cart/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId: getCartId(), linesId }),
  });

  if (!res.ok) throw new Error("Failed to remove cart lines");
  return (await res.json()).cart;
}

const clearCart = async (): Promise<Cart> => {
  const res = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId: getCartId() }),
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  return (await res.json()).cart;
}

/* ================= HOOK ================= */

export function useCart() {
  const qc = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (cart) => {
      qc.setQueryData(QUERY_KEYS.CART, cart);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateLine,
    onSuccess: (cart) => {
      qc.setQueryData(QUERY_KEYS.CART, cart);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeLine,
    onSuccess: (cart) => {
      qc.setQueryData(QUERY_KEYS.CART, cart);
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: (cart) => {
      qc.setQueryData(QUERY_KEYS.CART, cart);
    },
  });

  const items = cart?.lines.edges ?? [];
  const itemCount = items.reduce((n, i) => n + i.node.quantity, 0);

  return {
    cart,
    items,
    itemCount,
    isLoading,
    addToCart: addMutation.mutate,
    updateLine: updateMutation.mutate,
    removeLines: removeMutation.mutate,
    clearCart: clearMutation.mutate,
    isAdding: addMutation.isPending,
  };
}
