import { shopifyClient } from './shopify';

// GraphQL snippets
const CUSTOMER_CREATE = /* GraphQL */ `
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer { id email }
    customerUserErrors { code field message }
  }
}
`;

const CUSTOMER_ACCESS_TOKEN_CREATE = /* GraphQL */ `
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken { accessToken expiresAt }
    customerUserErrors { code field message }
  }
}
`;

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const data = await shopifyClient.request(CUSTOMER_CREATE, { input });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createCustomerAccessToken(input: { email: string; password: string }) {
  try {
    const data = await shopifyClient.request(CUSTOMER_ACCESS_TOKEN_CREATE, { input });
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Email lookup must be done via a Supabase Edge Function using Shopify Admin API
export async function findCustomerByEmail(email: string) {
  try {
    const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/find-customer-by-email`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to call find-customer-by-email');
    }
    const json = await res.json();
    return { data: json, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

