import { Hono } from "hono";
import { cors } from "hono/cors";
import { ShopifyAPI } from "./shopify-tools";
import { ProductSortKeys } from "./types/shopify";

const shopifyAPI = new ShopifyAPI({
  domain: "soqy-2.myshopify.com",
  storefrontAccessToken: "c740a7b2bd4a386d890b49260451b4be",
});

const app = new Hono()
  .basePath("/api")
  .use(cors())

  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  .get("/products", async (c) => {
    try {
      const url = new URL(c.req.url);
      const q = url.searchParams.get("query") || undefined;
      const sort = url.searchParams.get("sort") || undefined;
      const first = 24; // page size
      const after = url.searchParams.get("after") || undefined;
      const before = url.searchParams.get("before") || undefined;
      // Map simple sort values to Shopify sortKey + reverse
      let sortKey: any = undefined;
      let reverse: boolean | undefined = undefined;

      switch (sort) {
        case "price-asc":
          sortKey = "PRICE";
          reverse = false;
          break;
        case "price-desc":
          sortKey = "PRICE";
          reverse = true;
          break;
        case "newest":
          sortKey = "CREATED_AT";
          reverse = true;
          break;
        case "oldest":
          sortKey = "CREATED_AT";
          reverse = false;
          break;
        case "best-selling":
          sortKey = "BEST_SELLING";
          break;
        default:
          break;
      }

      // Use cursor-based pagination: for page>1 we need an "after" cursor.
      // Since we don't maintain cursor history on the client, we only support next/prev via pageInfo.
      // For direct page numbers, a stateless approach is not feasible; keep page as a hint only.
      const params: any = {};
      if (before) {
        params.last = first;
        params.before = before;
      } else {
        params.first = first;
        if (after) params.after = after;
      }
      if (q) params.query = q;
      if (sortKey) params.sortKey = sortKey;
      if (reverse !== undefined) params.reverse = reverse;

      const { products, pageInfo, cursors } =
        await shopifyAPI.getProducts(params);
      return c.json({ success: true, products, pageInfo, cursors });
    } catch (error: any) {
      console.error("/products error:", error);
      return c.json(
        { success: false, error: error?.message || String(error) },
        { status: 500 },
      );
    }
  })
  .post("/products", async (c) => {
    try {
      const { params } = await c.req.json();
      const { products, pageInfo, cursors } =
        await shopifyAPI.getProducts(params);
      return c.json({ success: true, products, pageInfo, cursors });
    } catch (error: any) {
      console.error("/products error:", error);
      return c.json(
        { success: false, error: error?.message || String(error) },
        { status: 500 },
      );
    }
  })

  .get("/product/:handle", async (c) => {
    const handle = c.req.param("handle");
    try {
      const product = await shopifyAPI.getProductByHandle(handle);
      if (!product) {
        return c.json(
          { success: false, message: "Product not found" },
          { status: 404 },
        );
      }
      return c.json({ success: true, product });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .get("/collections", async (c) => {
    try {
      const { collections } = await shopifyAPI.getCollections({ first: 5 });
      return c.json({ success: true, collections });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .get("/collection/:handle", async (c) => {
    const handle = c.req.param("handle");
    try {
      const collection = await shopifyAPI.getCollectionByHandle(handle, {});
      if (!collection) {
        return c.json(
          { success: false, message: "Collection not found" },
          { status: 404 },
        );
      }
      return c.json({ success: true, collection });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })
  .get("/collection/:handle/products/:sortkey", async (c) => {
    const handle = c.req.param("handle");
    const sortkey = c.req.param("sortkey");
    try {
      const collection = await shopifyAPI.getAllCollectionProducts(
        handle,
        sortkey as ProductSortKeys,
      );
      if (!collection) {
        return c.json(
          { success: false, message: "Collection not found" },
          { status: 404 },
        );
      }
      return c.json({ success: true, collection });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .post("/cart/create", async (c) => {
    const { variantId: merchandiseId, quantity } = await c.req.json();
    try {
      const cart = await shopifyAPI.createCart([{ merchandiseId, quantity }]);
      return c.json({ success: true, cart });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .post("/cart", async (c) => {
    const { cartId } = await c.req.json();
    try {
      const cart = await shopifyAPI.getCart(cartId);
      return c.json({ success: true, cart });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .post("/cart/add", async (c) => {
    const { cartId, variantId, quantity } = await c.req.json();
    try {
      const cart = await shopifyAPI.addToCart(cartId, [
        { merchandiseId: variantId, quantity },
      ]);
      return c.json({ success: true, cart });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .post("/cart/update", async (c) => {
    const { cartId, lineId, quantity } = await c.req.json();
    try {
      const cart = await shopifyAPI.updateCart(cartId, [
        { id: lineId, quantity },
      ]);
      return c.json({ success: true, cart });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .post("/cart/remove", async (c) => {
    const { cartId, linesId } = await c.req.json();
    try {
      const cart = await shopifyAPI.removeCartLines(cartId, linesId);
      return c.json({ success: true, cart });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .post("/cart/clear", async (c) => {
    const { cartId } = await c.req.json();
    try {
      const cart = await shopifyAPI.clearCart(cartId);
      return c.json({ success: true, cart });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .get("/clearCache", async (c) => {
    try {
      const cart = await shopifyAPI.clearCache();
      return c.json({ success: true, cart });
    } catch (error) {
      return c.json({ success: false, error }, { status: 500 });
    }
  })

  .onError((err, c) => {
    console.error("Unhandled error:", err);
    return c.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  });

export default app;
