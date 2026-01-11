import { type ShopifyConfig, type QueryOptions, type GraphQLResponse, type PaginationParams, type SortParams, type FilterParams, type Product, type PageInfo, type Collection, type Cart, type Customer, ProductSortKeys } from './types/shopify';

// ============================================
// GraphQL Client with Caching & Retry Logic
// ============================================

export class ShopifyStorefrontClient {
  private config: ShopifyConfig;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor(config: ShopifyConfig) {
    this.config = {
      apiVersion: '2024-01',
      maxRetries: 3,
      timeout: 10000,
      ...config,
    };
    this.cache = new Map();
  }

  private getEndpoint(): string {
    return `https://${this.config.domain}/api/${this.config.apiVersion}/graphql.json`;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': this.config.storefrontAccessToken,
    };

    if (this.config.locale) {
      headers['Accept-Language'] = this.config.locale;
    }

    if (this.config.country) {
      headers['X-Shopify-Country'] = this.config.country;
    }

    return headers;
  }

  private generateCacheKey(query: string, variables?: Record<string, any>): string {
    return JSON.stringify({ query, variables });
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    retryCount: number = this.config.maxRetries!
  ): Promise<T> {
    for (let i = 0; i < retryCount; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retryCount - 1) throw error;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries exceeded');
  }

  async query<T = any>(
    query: string,
    options: QueryOptions = {}
  ): Promise<GraphQLResponse<T>> {
    const {
      variables,
      headers = {},
      cachePolicy = 'cache-first',
      retryCount = this.config.maxRetries,
      timeout = this.config.timeout || 10000,
    } = options;

    const cacheKey = this.generateCacheKey(query, variables);

    // Check cache first
    if (cachePolicy === 'cache-first' || cachePolicy === 'cache-and-network') {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        if (cachePolicy === 'cache-first') {
          return cached.data;
        }
        // For cache-and-network, return cached immediately but fetch in background
        this.fetchAndCache(query, variables, cacheKey, headers, timeout || this.config.timeout || 10000).catch(console.error);
        return cached.data;
      }
    }

    return this.withRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(this.getEndpoint(), {
          method: 'POST',
          headers: { ...this.getHeaders(), ...headers },
          body: JSON.stringify({ query, variables }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: any = await response.json();

        if (data.errors && data.errors.length > 0) {
          const error = new Error(`GraphQL Errors: ${data.errors.map((e: any) => e.message).join(', ')}`);
          (error as any).graphQLErrors = data.errors;
          throw error;
        }

        const typedData: GraphQLResponse<T> = data;

        // Cache successful responses
        if (typedData.data) {
          this.cache.set(cacheKey, {
            data: typedData,
            timestamp: Date.now(),
          });
        }

        return typedData;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
          }
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    }, retryCount);
  }

  private async fetchAndCache(
    query: string,
    variables: Record<string, any> | undefined,
    cacheKey: string,
    headers: Record<string, string>,
    timeout: number
  ): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(this.getEndpoint(), {
        method: 'POST',
        headers: { ...this.getHeaders(), ...headers },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: any = await response.json();
        if (data?.data) {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
          });
        }
      }
    } catch (error) {
      // Silent fail for background refresh
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  setCacheTTL(ttl: number): void {
    this.cacheTTL = ttl;
  }
}

// ============================================
// Query Builders
// ============================================

export const QueryBuilder = {
  // Products
  products: (fields: string) => `
  products(
    first: $first
    after: $after
    last: $last
    before: $before
    sortKey: $sortKey
    reverse: $reverse
    query: $query
  ) {
    edges {
      node { ${fields} }
      cursor
      }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
`,

  // Collections
  collections: (fields: string) => `
  collections(
    first: $first
    after: $after
    last: $last
    before: $before
    sortKey: $sortKey
    reverse: $reverse
  ) {
    edges {
      node { ${fields} }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
`,

  // Cart (uses variable `$cartId`)
  cart: (fields: string): string => `
  cart(id: $cartId) {
    ${fields}
  }
`,

  // Customer (uses variable `$customerAccessToken`)
  customer: (fields: string): string => `
  customer(customerAccessToken: $customerAccessToken) {
    ${fields}
  }
`,
};

// ============================================
// Field Fragments (Reusable)
// ============================================

export const Fragments = {
  product: `
    id
    handle
    title
    description
    descriptionHtml
    productType
    vendor
    tags
    availableForSale
    createdAt
    updatedAt
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          sku
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      id
      name
      values
    }
  `,

  collection: `
    id
    handle
    title
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
  `,

  cart: `
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
              selectedOptions {
                name
                value
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
  `,

  customer: `
    id
    email
    firstName
    lastName
    phone
    acceptsMarketing
    defaultAddress {
      id
      address1
      address2
      city
      company
      country
      firstName
      lastName
      phone
      province
      zip
    }
    addresses(first: 10) {
      edges {
        node {
          id
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          province
          zip
        }
      }
    }
    orders(first: 10) {
      edges {
        node {
          id
          orderNumber
          processedAt
          totalPrice {
            amount
            currencyCode
          }
          financialStatus
          fulfillmentStatus
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
                discountedTotalPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `,
};

// ============================================
// Shopify API Service
// ============================================

export class ShopifyAPI {
  private client: ShopifyStorefrontClient;

  constructor(config: ShopifyConfig) {
    this.client = new ShopifyStorefrontClient(config);
  }

  // ====================
  // PRODUCT OPERATIONS
  // ====================

  async getProducts(params?: PaginationParams & SortParams & FilterParams) {
    const query = `
    query GetProducts(
      $first: Int
      $after: String
      $last: Int
      $before: String
      $sortKey: ProductSortKeys
      $reverse: Boolean
      $query: String
    ) {
      ${QueryBuilder.products(Fragments.product)}
    }
  `;

    const response = await this.client.query<{
      products: {
        edges: { node: Product }[];
        pageInfo: PageInfo;
        totalCount: number;
      };
    }>(query, {
      variables: {
        first: params?.first,
        after: params?.after,
        last: params?.last,
        before: params?.before,
        sortKey: params?.sortKey,
        reverse: params?.reverse,
        query: params?.query,
      },
    });

    return {
      products: response.data?.products.edges.map(e => e.node) ?? [],
      pageInfo: response.data?.products.pageInfo,
      cursors: {
        startCursor: response.data?.products.pageInfo.startCursor,
        endCursor: response.data?.products.pageInfo.endCursor,
      }
    };
  }


  async getProductByHandle(handle: string) {
    const query = `
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ${Fragments.product}
        }
      }
    `;

    const response = await this.client.query<{ productByHandle: Product }>(query, {
      variables: { handle },
    });

    return response.data?.productByHandle;
  }

  async getProductRecommendations(productId: string, limit: number = 10) {
    const query = `
      query GetProductRecommendations($productId: ID!, $limit: Int!) {
        productRecommendations(productId: $productId) {
          ${Fragments.product}
        }
      }
    `;

    const response = await this.client.query<{ productRecommendations: Product[] }>(query, {
      variables: { productId, limit },
    });

    return response.data?.productRecommendations || [];
  }

  // ====================
  // COLLECTION OPERATIONS
  // ====================

  async getCollections(params?: PaginationParams & SortParams) {
    const query = `
      query GetCollections(
        $first: Int,
        $after: String,
        $last: Int,
        $before: String,
        $sortKey: CollectionSortKeys,
        $reverse: Boolean
      ) {
        ${QueryBuilder.collections(Fragments.collection)}
      }
    `;

    const response = await this.client.query<{ collections: { edges: Array<{ node: Collection }>; pageInfo: PageInfo } }>(query, {
      variables: params,
    });

    return {
      collections: response.data?.collections?.edges?.map(edge => edge.node) || [],
      pageInfo: response.data?.collections?.pageInfo,
    };
  }

  async getCollectionByHandle(
    handle: string,
    productParams?: PaginationParams & SortParams
  ): Promise<Collection | null> {
    // Set defaults
    const defaultParams = {
      first: 20,
      sortKey: ProductSortKeys.COLLECTION_DEFAULT,
      reverse: false,
      ...productParams,
    };

    const query = `
    query GetCollectionByHandle(
      $handle: String!, 
      $first: Int, 
      $after: String, 
      $last: Int,
      $before: String,
      $sortKey: ProductCollectionSortKeys, 
      $reverse: Boolean
    ) {
      collectionByHandle(handle: $handle) {
        ${Fragments.collection}
        products(
          first: $first,
          after: $after,
          last: $last,
          before: $before,
          sortKey: $sortKey,
          reverse: $reverse
        ) {
          edges {
            node {
              ${Fragments.product}
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
  `;

    try {
      const response = await this.client.query<{
        collectionByHandle: Collection | null
      }>(query, {
        variables: { handle, ...defaultParams },
      });

      if (!response.data?.collectionByHandle) {
        console.warn(`Collection with handle "${handle}" not found`);
        return null;
      }

      return response.data.collectionByHandle;
    } catch (error) {
      console.error(`Error fetching collection "${handle}":`, error);
      throw new Error(`Failed to fetch collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper method for paginated fetching
  async getAllCollectionProducts(
    handle: string,
    sortKey?: string,
    reverse?: boolean
  ): Promise<Product[]> {
    const allProducts: Product[] = [];
    let hasNextPage = true;
    let cursor: string | undefined;

    while (hasNextPage) {
      const collection = await this.getCollectionByHandle(handle, {
        first: 50, // Max per page
        after: cursor,
        sortKey: this.getSortKey(sortKey) as ProductSortKeys,
        reverse,
      });

      if (!collection) break;

      const products = collection.products.edges.map(edge => edge.node);
      allProducts.push(...products);

      hasNextPage = collection.products.pageInfo.hasNextPage;
      cursor = collection.products.pageInfo.endCursor;
    }

    return allProducts;
  }
  private getSortKey(sortBy?: string): string {
    switch (sortBy) {
      case 'price-asc':
        return 'PRICE';
      case 'price-desc':
        return 'PRICE';
      case 'title-asc':
        return 'TITLE';
      case 'title-desc':
        return 'TITLE';
      case 'created-desc':
        return 'CREATED_AT';
      default:
        return 'RELEVANCE';
    }
  }
  // Method with filters
  async getCollectionByHandleWithFilters(
    handle: string,
    filters?: {
      available?: boolean;
      priceRange?: { min: number; max: number };
      productType?: string;
      vendor?: string;
      tags?: string[];
    },
    productParams?: PaginationParams & SortParams
  ): Promise<Collection> {
    const defaultParams = {
      first: 20,
      sortKey: ProductSortKeys.COLLECTION_DEFAULT,
      reverse: false,
      ...productParams,
    };

    // Build filters array
    const filterArray: string[] = [];

    if (filters?.available !== undefined) {
      filterArray.push(`{available: ${filters.available}}`);
    }

    if (filters?.priceRange) {
      filterArray.push(
        `{price: {min: ${filters.priceRange.min}, max: ${filters.priceRange.max}}}`
      );
    }

    if (filters?.productType) {
      filterArray.push(`{productType: "${filters.productType}"}`);
    }

    if (filters?.vendor) {
      filterArray.push(`{productVendor: "${filters.vendor}"}`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      filterArray.push(`{tag: [${filters.tags.map(t => `"${t}"`).join(', ')}]}`);
    }

    const filtersString = filterArray.length > 0
      ? `, filters: [${filterArray.join(', ')}]`
      : '';

    const query = `
    query GetCollectionByHandle(
      $handle: String!, 
      $first: Int, 
      $after: String,
      $sortKey: ProductCollectionSortKeys, 
      $reverse: Boolean
    ) {
      collectionByHandle(handle: $handle) {
        ${Fragments.collection}
        products(
          first: $first,
          after: $after,
          sortKey: $sortKey,
          reverse: $reverse
          ${filtersString}
        ) {
          edges {
            node {
              ${Fragments.product}
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
  `;

    try {
      const response = await this.client.query<{
        collectionByHandle: Collection
      }>(query, {
        variables: { handle, ...defaultParams },
      });
      return response.data?.collectionByHandle as Collection;
    } catch (error) {
      console.error(`Error fetching collection "${handle}":`, error);
      throw error;
    }
  }

  // ====================
  // CART OPERATIONS
  // ====================

  async createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
    const query = `
      mutation CreateCart($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            ${Fragments.cart}
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await this.client.query<{
      cartCreate: { cart: Cart; userErrors: Array<{ field: string; message: string }> }
    }>(query, {
      variables: { lines },
      cachePolicy: 'network-only',
    });

    if (response.data?.cartCreate?.userErrors?.length) {
      throw new Error(response.data.cartCreate.userErrors[0]?.message || 'Unknown error');
    }

    return response.data?.cartCreate?.cart;
  }

  async getCart(cartId: string) {
    const query = `
      query GetCart($cartId: ID!) {
        ${QueryBuilder.cart(Fragments.cart)}
      }
    `;

    const response = await this.client.query<{ cart: Cart }>(query, {
      variables: { cartId },
    });

    return response.data?.cart;
  }

  async addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
    const query = `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ${Fragments.cart}
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await this.client.query<{
      cartLinesAdd: { cart: Cart; userErrors: Array<{ field: string; message: string }> }
    }>(query, {
      variables: { cartId, lines },
      cachePolicy: 'network-only',
    });

    if (response.data?.cartLinesAdd?.userErrors?.length) {
      throw new Error(response.data.cartLinesAdd.userErrors[0]?.message || 'Unknown error');
    }

    return response.data?.cartLinesAdd?.cart;
  }

  async updateCart(cartId: string, updates: Array<{ id: string; quantity: number }>) {
    const query = `
      mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${Fragments.cart}
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await this.client.query<{
      cartLinesUpdate: { cart: Cart; userErrors: Array<{ field: string; message: string }> }
    }>(query, {
      variables: {
        cartId,
        lines: updates.map(update => ({
          id: update.id,
          quantity: update.quantity,
        })),
      },
      cachePolicy: 'network-only',
    });

    if (response.data?.cartLinesUpdate?.userErrors?.length) {
      throw new Error(response.data.cartLinesUpdate.userErrors[0]?.message || 'Unknown error');
    }

    return response.data?.cartLinesUpdate?.cart;
  }

  async removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
    const query = `
    mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ${Fragments.cart}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const response = await this.client.query<{
      cartLinesRemove: { cart: Cart; userErrors: Array<{ field: string; message: string }> }
    }>(query, {
      variables: { cartId, lineIds },
      cachePolicy: 'network-only',
    });

    if (response.data?.cartLinesRemove?.userErrors?.length) {
      throw new Error(response.data.cartLinesRemove.userErrors[0]?.message || 'Unknown error');
    }

    return response.data?.cartLinesRemove?.cart!;
  }

  async clearCart(cartId: string): Promise<Cart> {
    // First get the cart to get all line IDs
    const cart = await this.getCart(cartId);

    if (!cart?.lines?.edges?.length) {
      return cart!;
    }

    const lineIds = cart.lines.edges.map(edge => edge.node.id);

    if (lineIds.length === 0) {
      return cart;
    }

    return this.removeCartLines(cartId, lineIds);
  }

  // Add to cart fragment (optional, if you want to include line IDs in the cart fragment):
  // In your existing Fragments.cart, ensure you have:
  // lines(first: 100) {
  //   edges {
  //     node {
  //       id  // Make sure this is included
  //       ...
  //     }
  //   }
  // }

  // ====================
  // CUSTOMER OPERATIONS
  // ====================

  async getCustomer(customerAccessToken: string) {
    const query = `
      query GetCustomer($customerAccessToken: String!) {
        ${QueryBuilder.customer(Fragments.customer)}
      }
    `;

    const response = await this.client.query<{ customer: Customer }>(query, {
      variables: { customerAccessToken },
      cachePolicy: 'network-only',
    });

    return response.data?.customer;
  }

  async createCustomer(email: string, password: string, firstName?: string, lastName?: string) {
    const query = `
      mutation CreateCustomer($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const response = await this.client.query<{
      customerCreate: {
        customer?: { id: string };
        customerUserErrors: Array<{ code: string; field: string; message: string }>;
      }
    }>(query, {
      variables: {
        input: {
          email,
          password,
          firstName,
          lastName,
        },
      },
      cachePolicy: 'network-only',
    });

    if (response.data?.customerCreate.customerUserErrors?.length) {
      throw new Error(response.data.customerCreate.customerUserErrors[0]?.message || 'Unknown error');
    }

    return response.data?.customerCreate.customer;
  }

  // ====================
  // SEARCH OPERATIONS
  // ====================

  async searchProducts(query: string, params?: PaginationParams & SortParams) {
    return this.getProducts({
      query,
      sortKey: ProductSortKeys.RELEVANCE,
      ...params,
    });
  }

  // ====================
  // UTILITY METHODS
  // ====================

  async ping(): Promise<boolean> {
    try {
      const query = `
        query Ping {
          shop {
            name
          }
        }
      `;

      await this.client.query(query, {
        timeout: 5000,
        cachePolicy: 'network-only',
      });

      return true;
    } catch {
      return false;
    }
  }

  clearCache(): void {
    this.client.clearCache();
  }
}

// ============================================
// ADVANCED SEARCH SERVICE
// ============================================

export class ShopifySearchService {
  private api: ShopifyAPI;
  private searchCache: Map<string, { results: Product[]; timestamp: number }>;
  private readonly SEARCH_TTL = 2 * 60 * 1000; // 2 minutes

  constructor(api: ShopifyAPI) {
    this.api = api;
    this.searchCache = new Map();
  }

  async searchWithFilters(options: {
    query?: string;
    productTypes?: string[];
    vendors?: string[];
    tags?: string[];
    priceRange?: { min?: number; max?: number };
    availability?: 'available' | 'sold-out' | 'coming-soon';
    sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'created-desc';
    pagination?: PaginationParams;
  }): Promise<{
    products: Product[];
    filters: {
      productTypes: string[];
      vendors: string[];
      priceRange: { min: number; max: number };
    };
    pageInfo: PageInfo;
  }> {
    // Build advanced query
    const queryParts: string[] = [];

    if (options.query) {
      queryParts.push(options.query);
    }

    if (options.productTypes?.length) {
      queryParts.push(`product_type:${options.productTypes.map(type => `"${type}"`).join(' OR ')}`);
    }

    if (options.vendors?.length) {
      queryParts.push(`vendor:${options.vendors.map(vendor => `"${vendor}"`).join(' OR ')}`);
    }

    if (options.tags?.length) {
      queryParts.push(`tag:${options.tags.map(tag => `"${tag}"`).join(' OR ')}`);
    }

    if (options.priceRange) {
      if (options.priceRange.min !== undefined) {
        queryParts.push(`variants.price:>=${options.priceRange.min}`);
      }
      if (options.priceRange.max !== undefined) {
        queryParts.push(`variants.price:<=${options.priceRange.max}`);
      }
    }

    if (options.availability) {
      switch (options.availability) {
        case 'available':
          queryParts.push('available_for_sale:true');
          break;
        case 'sold-out':
          queryParts.push('available_for_sale:false');
          break;
        case 'coming-soon':
          queryParts.push('published_status:unpublished');
          break;
      }
    }

    const searchQuery = queryParts.join(' AND ');

    // Get products
    const result = await this.api.getProducts({
      query: searchQuery,
      sortKey: this.getSortKey(options.sortBy) as ProductSortKeys,
      reverse: options.sortBy === 'price-desc' || options.sortBy === 'title-desc',
      ...options.pagination,
    });

    // Extract filters from results
    const filters = this.extractFilters(result.products);

    return {
      products: result.products,
      filters,
      pageInfo: result.pageInfo!,
    };
  }

  private getSortKey(sortBy?: string): string {
    switch (sortBy) {
      case 'price-asc':
        return 'PRICE';
      case 'price-desc':
        return 'PRICE';
      case 'title-asc':
        return 'TITLE';
      case 'title-desc':
        return 'TITLE';
      case 'created-desc':
        return 'CREATED_AT';
      default:
        return 'RELEVANCE';
    }
  }

  private extractFilters(products: Product[]): {
    productTypes: string[];
    vendors: string[];
    priceRange: { min: number; max: number };
  } {
    const productTypes = new Set<string>();
    const vendors = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach(product => {
      if (product.productType) {
        productTypes.add(product.productType);
      }
      if (product.vendor) {
        vendors.add(product.vendor);
      }

      // Calculate price range
      const price = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    });

    return {
      productTypes: Array.from(productTypes),
      vendors: Array.from(vendors),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice,
      },
    };
  }
}