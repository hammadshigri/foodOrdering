import { GraphQLClient } from 'graphql-request';

const storeDomain = process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN as string;
const storefrontToken = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;

if (!storeDomain) {
  // eslint-disable-next-line no-console
  console.warn('Missing EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN');
}
if (!storefrontToken) {
  // eslint-disable-next-line no-console
  console.warn('Missing EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
}

export const shopifyClient = new GraphQLClient(
  `https://${storeDomain}/api/2023-10/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
  }
);

export type ShopifyClientType = typeof shopifyClient;

