import CartProduct from "@/components/navbar/cart/cart-product";
import { useCart } from "@/hooks/use-cart";
import CartEmpty from "./empty-cart";

export default function CartContent() {
  const { items, updateLine, removeLines, isLoading } = useCart();

  if (!items.length || isLoading) return <CartEmpty />;

  return (
    <div className="flex flex-col gap-2 h-full max-h-full w-full min-w-90 p-2 border rounded-sm">
      <p className="text-sm opacity-45">ITEMS IN BAG</p>
      <div className="flex flex-col gap-2 overflow-y-auto h-full max-h-full">
        {items.map(({ node }) => (
          <CartProduct
            key={node.id}
            cartline={node}
            onQuantityChange={(q) => (
              updateLine({ lineId: node.id, quantity: q })
            )}
            onRemove={() => (
              removeLines([node.id])
            )}
          />
        ))}
      </div>
    </div>
  );
}
