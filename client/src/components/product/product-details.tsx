import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/shopify';
import { useMemo, useState } from 'react';
import Options from '../options';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { Label } from '../ui/label';

export default function ProductDetails({
  product,
  onAddToCart,
  adding,
}: {
  product: Product;
  onAddToCart: (variantId: string) => void;
  adding?: boolean;
}) {
  const [variant, setVariant] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const matchedVariant = useMemo(() => {
    return product.variants.edges.find(({ node }) => {
      const optionMap = node.selectedOptions.reduce((acc: Record<string, string>, o) => {
        acc[o.name] = o.value;
        return acc;
      }, {});
      return Object.entries(variant).every(([k, v]) => optionMap[k] === v) && node.availableForSale;
    });
  }, [product, variant]);

  const isVariantSelected = Object.keys(variant).length > 0 && !!matchedVariant;

  return (
    <div className="flex flex-col sm:items-center max-sm:justify-center gap-4 max-w-lg sm:w-full">
      <div className="flex flex-row gap-2">
        <Badge variant="secondary" className="uppercase">{product.productType}</Badge>
        <Badge variant="secondary" className="uppercase">{product.vendor}</Badge>
      </div>
      <h1 className="text-4xl uppercase sm:text-center">{product.title}</h1>
      <div className="text-sm opacity-75 sm:text-center" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }} />
      <Options options={product.options} value={variant} onChange={setVariant} />
      <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          <Label>QUANTITY</Label>
          <div className="flex flex-row items-center gap-2">
            <Button variant="secondary" size="icon" className="hover:bg-foreground/5 cursor-pointer" disabled={quantity < 0} onClick={() => { setQuantity(prev => prev - 1) }}><Minus className="size-3" /></Button>
            <span className={cn("px-2", (quantity < 0) ? "opacity-25" : "")}>{quantity}</span>
            <Button variant="secondary" size="icon" className="hover:bg-foreground/5 cursor-pointer" disabled={quantity > 50} onClick={() => { setQuantity(prev => prev + 1) }}><Plus className="size-3" /></Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label>TOTAL</Label>
          <div className="flex flex-row items-center gap-2">
            <p className="text-3xl font-semibold min-w-fit">
              {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
            </p>

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:items-center w-full">


        <Button
          size="lg"
          className="uppercase w-full cursor-pointer"
          disabled={!isVariantSelected || adding}
          onClick={() => matchedVariant && onAddToCart(matchedVariant.node.id)}
        >
          {isVariantSelected ? 'Add to Cart' : 'Select options'}
        </Button>
      </div>
    </div>
  );
}
