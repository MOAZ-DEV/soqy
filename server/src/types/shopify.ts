// ============================================
// Core Configuration & Types
// ============================================

export interface ShopifyConfig {
  domain: string;
  storefrontAccessToken: string;
  apiVersion?: string;
  maxRetries?: number;
  timeout?: number;
  locale?: string;
  country?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
  extensions?: Record<string, any>;
}

export interface PaginationParams {
  first?: number;
  after?: string | null;
  last?: number;
  before?: string | null;
}

export interface SortParams {
  sortKey?: ProductSortKeys;
  reverse?: boolean;
}

export enum ProductSortKeys {
  TITLE = 'TITLE',
  PRICE = 'PRICE',
  BEST_SELLING = 'BEST_SELLING',
  CREATED = 'CREATED',
  ID = 'ID',
  MANUAL = 'MANUAL',
  COLLECTION_DEFAULT = 'COLLECTION_DEFAULT',
  RELEVANCE = 'RELEVANCE',
}

export interface FilterParams {
  query?: string;
  savedSearchId?: string;
  productType?: string;
  productVendor?: string;
  tag?: string;
  collectionId?: string;
  price?: {
    min?: number;
    max?: number;
  };
}

export interface Image {
  id?: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string;
  price: MoneyV2;
  compareAtPrice?: MoneyV2;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: Image;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  productType?: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
  featuredImage?: Image;
  images: {
    edges: Array<{
      node: Image;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange?: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  image?: Image;
  products: {
    edges: Array<{
      node: Product;
    }>;
    pageInfo: PageInfo;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: MoneyV2;
    subtotalAmount: MoneyV2;
    totalTaxAmount: MoneyV2;
    totalDutyAmount: MoneyV2;
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage?: Image;
    };
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  };
  cost: {
    totalAmount: MoneyV2;
  };
}

export interface Customer {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing: boolean;
  defaultAddress?: Address;
  addresses: {
    edges: Array<{
      node: Address;
    }>;
  };
  orders: {
    edges: Array<{
      node: Order;
    }>;
  };
}

export interface Address {
  id: string;
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  province?: string;
  zip?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPrice: MoneyV2;
  financialStatus?: string;
  fulfillmentStatus?: string;
  lineItems: {
    edges: Array<{
      node: OrderLineItem;
    }>;
  };
}

export interface OrderLineItem {
  title: string;
  quantity: number;
  variant?: ProductVariant;
  discountedTotalPrice?: MoneyV2;
}

export interface QueryOptions {
  variables?: Record<string, any>;
  headers?: Record<string, string>;
  cachePolicy?: 'cache-first' | 'network-only' | 'cache-and-network';
  retryCount?: number;
  timeout?: number;
}
