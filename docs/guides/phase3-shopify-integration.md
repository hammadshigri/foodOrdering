# Phase 3: Shopify Integration

## 🎯 Phase Overview

Integrate Shopify Storefront API for product data, implement GraphQL queries, and set up the foundation for e-commerce functionality.

## 📋 Phase 3 Checklist

### 🛍️ Shopify Store Setup

- [ ] Create Shopify store (or use existing)
- [ ] Enable Storefront API in Shopify admin
- [ ] Generate Storefront access token
- [ ] Add sample products to store
- [ ] Configure product images and variants
- [ ] Set up product collections/categories
- [ ] Update `.env` with Shopify credentials

### 📦 Shopify Dependencies

- [ ] Install GraphQL client:

  ```bash
  npm install graphql
  npm install graphql-request
  ```

- [ ] Install additional utilities:
  ```bash
  npm install @shopify/shopify-api
  npm install @shopify/storefront-api-client
  ```

### 🔗 Shopify Client Setup

- [ ] Create `lib/shopify.ts`:

  ```typescript
  import { GraphQLClient } from "graphql-request";
  import {
    EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN,
    EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  } from "@env";

  const shopifyClient = new GraphQLClient(
    `https://${EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token":
          EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
    }
  );

  export { shopifyClient };
  ```

### 🔐 Customer Account Linking APIs

- [ ] Implement Storefront API mutations for customer linking:

  ```graphql
  # Create a customer when none exists
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }

  # Create a customer access token for authenticated customer calls
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  ```

- [ ] Create `lib/customerApi.ts`:

  ```typescript
  import { shopifyClient } from "./shopify";

  export async function createCustomer(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    // call customerCreate
  }

  export async function createCustomerAccessToken(input: {
    email: string;
    password: string;
  }) {
    // call customerAccessTokenCreate
  }

  export async function findCustomerByEmail(email: string) {
    // call your Supabase Edge Function that uses Shopify Admin API to search by email
    // Rationale: Storefront API does not support searching customers by email.
  }
  ```

- [ ] Add client utility to call the Supabase Edge Function (email lookup) and handle responses
- [ ] Ensure Admin API credentials are ONLY used inside the Supabase Edge Function (never in the mobile app)
- [ ] On successful link/create, persist `shopify_customer_id` and `customerAccessToken` to Supabase `profiles`
- [ ] Add error handling and retries for linking flow
- [ ] Write basic tests/mocks for `customerApi` functions

- [ ] Ensure customer-specific data calls (orders, profile) use the stored `customerAccessToken` from Supabase.

### 📊 Product Types

- [ ] Create `types/product.ts`:

  ```typescript
  export interface Product {
    id: string;
    title: string;
    description: string;
    handle: string;
    images: ProductImage[];
    variants: ProductVariant[];
    priceRange: PriceRange;
    tags: string[];
    productType: string;
    vendor: string;
  }

  export interface ProductImage {
    id: string;
    url: string;
    altText: string;
    width: number;
    height: number;
  }

  export interface ProductVariant {
    id: string;
    title: string;
    price: Money;
    availableForSale: boolean;
    selectedOptions: SelectedOption[];
  }

  export interface Money {
    amount: string;
    currencyCode: string;
  }

  export interface PriceRange {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  }

  export interface SelectedOption {
    name: string;
    value: string;
  }
  ```

### 🔍 GraphQL Queries

- [ ] Create `lib/queries.ts`:

  ```typescript
  export const GET_PRODUCTS = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            title
            handle
            description
            productType
            vendor
            tags
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
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
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  export const GET_PRODUCT_BY_HANDLE = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        productType
        vendor
        tags
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
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
      }
    }
  `;

  export const SEARCH_PRODUCTS = `
    query SearchProducts($query: String!, $first: Int!) {
      products(query: $query, first: $first) {
        edges {
          node {
            id
            title
            handle
            productType
            vendor
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;
  ```

### 🛍️ Product API Functions

- [ ] Create `lib/productApi.ts`:

  ```typescript
  import { shopifyClient } from "./shopify";
  import {
    GET_PRODUCTS,
    GET_PRODUCT_BY_HANDLE,
    SEARCH_PRODUCTS,
  } from "./queries";
  import { Product } from "../types/product";

  export const fetchProducts = async (first: number = 20, after?: string) => {
    try {
      const data = await shopifyClient.request(GET_PRODUCTS, { first, after });
      return { data: data.products, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  export const fetchProductByHandle = async (handle: string) => {
    try {
      const data = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, {
        handle,
      });
      return { data: data.product, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  export const searchProducts = async (query: string, first: number = 20) => {
    try {
      const data = await shopifyClient.request(SEARCH_PRODUCTS, {
        query,
        first,
      });
      return { data: data.products, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
  ```

### 🏪 Product Store

- [ ] Create `store/productStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer } from "react";
  import { Product } from "../types/product";

  interface ProductState {
    products: Product[];
    featuredProducts: Product[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    cursor: string | null;
  }

  // Product store implementation with actions for:
  // - Fetch products
  // - Load more products
  // - Search products
  // - Fetch featured products
  // - Fetch single product
  ```

### 🎨 Product Components

- [ ] Create `components/product/ProductCard.tsx`
- [ ] Create `components/product/ProductList.tsx`
- [ ] Create `components/product/ProductGrid.tsx`
- [ ] Create `components/product/ProductImage.tsx`
- [ ] Create `components/product/ProductPrice.tsx`
- [ ] Create `components/product/ProductVariantSelector.tsx`

### 📱 Product Screens

- [ ] Update `app/(tabs)/index.tsx` (Home/Shop screen)
- [ ] Create `app/product/[handle].tsx` (Product detail screen)
- [ ] Create `app/search.tsx` (Search screen)

### 🔍 Search Functionality

- [ ] Implement search input component
- [ ] Add search filters (category, price, etc.)
- [ ] Implement search history
- [ ] Add search suggestions

### 📊 Product Data Management

- [ ] Implement product caching
- [ ] Add loading states
- [ ] Handle error states
- [ ] Implement infinite scroll for product lists
- [ ] Add product image optimization

### 🎯 Featured Products

- [ ] Create featured products query
- [ ] Implement featured products section
- [ ] Add product recommendations

### 🏷️ Categories and Collections

- [ ] Create collections query
- [ ] Implement category filtering
- [ ] Add collection pages
- [ ] Create category navigation

### 🧪 Shopify Integration Testing

- [ ] Test product fetching
- [ ] Test product search
- [ ] Test product detail loading
- [ ] Test image loading
- [ ] Test error handling
- [ ] Test pagination
- [ ] Test search functionality

## ✅ Phase 3 Completion Criteria

- [ ] Shopify store is configured with products
- [ ] Storefront API is accessible
- [ ] Products load from Shopify
- [ ] Product search works
- [ ] Product detail pages work
- [ ] Product images load correctly
- [ ] Product variants are handled
- [ ] Error handling is implemented
- [ ] Loading states are working
- [ ] Product caching is functional
- [ ] Customer can be created or linked on first login
- [ ] `shopify_customer_id` and `customerAccessToken` persisted in Supabase and used for customer calls

## 🚀 Next Steps

After completing Phase 3:

1. Begin Phase 4: Core app features and navigation
2. Implement shopping cart functionality
3. Add user favorites/wishlist

## 📝 Notes

- Test with various product types (clothing, accessories, etc.)
- Ensure proper image optimization for mobile
- Handle product variants correctly
- Implement proper error boundaries
- Test search performance with large catalogs
- Verify product data mapping is correct
