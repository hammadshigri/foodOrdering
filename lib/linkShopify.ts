import { supabase } from './supabase';
import { createCustomer, createCustomerAccessToken, findCustomerByEmail } from './customerApi';

export async function linkShopifyAccount({
  userId,
  email,
  password,
  firstName,
  lastName,
}: {
  userId: string;
  email: string;
  password?: string; // if provided, we can create a customer access token immediately
  firstName?: string;
  lastName?: string;
}) {
  // 1) Try to locate existing Shopify customer by email via Edge Function
  const lookup = await findCustomerByEmail(email);

  let shopifyCustomerId: string | undefined;
  let customerAccessToken: string | undefined;

  if (lookup.data?.customerId) {
    shopifyCustomerId = lookup.data.customerId as string;
    // Optionally create access token if password supplied (for explicit Shopify login)
    if (password) {
      const tokenResp = await createCustomerAccessToken({ email, password });
      customerAccessToken = tokenResp.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
    }
  } else {
    // 2) Create a new Shopify customer
    const created = await createCustomer({ email, password: password ?? Math.random().toString(36), firstName, lastName });
    shopifyCustomerId = created.data?.customerCreate?.customer?.id;
    if (password) {
      const tokenResp = await createCustomerAccessToken({ email, password });
      customerAccessToken = tokenResp.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
    }
  }

  // 3) Persist identifiers in Supabase profile
  await supabase
    .from('profiles')
    .update({
      shopify_customer_id: shopifyCustomerId,
      shopify_customer_access_token: customerAccessToken,
    })
    .eq('id', userId);

  return { shopifyCustomerId, customerAccessToken };
}

