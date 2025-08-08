# Phase 2: Authentication & User Management

## 🎯 Phase Overview

Implement Supabase authentication system with email/password and magic link support, including user profile management and session persistence.

## 📋 Phase 2 Checklist

### 🔐 Supabase Project Setup

- [ ] Create Supabase project at https://supabase.com
- [ ] Get project URL and anon key
- [ ] Update `.env` file with Supabase credentials
- [ ] Set up database schema for user profiles
- [ ] Configure authentication settings in Supabase dashboard
- [ ] Create Supabase Edge Function for Shopify email lookup using Admin API (e.g., `find-customer-by-email`)
- [ ] Configure Supabase function secrets for Shopify Admin API (e.g., `SHOPIFY_ADMIN_ACCESS_TOKEN`, `SHOPIFY_STORE_DOMAIN`)

### 🗄️ Database Schema Setup

- [ ] Create profiles table in Supabase:

  ```sql
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    shopify_customer_id TEXT,
    shopify_customer_access_token TEXT,
    expo_push_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

- [ ] Set up Row Level Security (RLS):

  ```sql
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

  CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
  ```

- [ ] Create function to handle new user signup:

  ```sql
  CREATE OR REPLACE FUNCTION handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  ```

### 📦 Supabase Client Setup

- [ ] Create `lib/supabase.ts`:

  ```typescript
  import { createClient } from "@supabase/supabase-js";
  import {
    EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY,
  } from "@env";

  export const supabase = createClient(
    EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
  ```

### 🔑 Authentication Types

- [ ] Create `types/auth.ts`:

  ```typescript
  export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    shopify_customer_id?: string;
    shopify_customer_access_token?: string;
    expo_push_token?: string;
  }

  export interface AuthState {
    user: User | null;
    session: any | null;
    loading: boolean;
  }

  export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface SignupCredentials {
    email: string;
    password: string;
    full_name: string;
  }
  ```

### 🏪 Authentication Store

- [ ] Create `store/authStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer, useEffect } from "react";
  import { supabase } from "../lib/supabase";
  import {
    AuthState,
    User,
    LoginCredentials,
    SignupCredentials,
  } from "../types/auth";

  // Auth reducer and context implementation
  ```

### 🔐 Authentication Functions

- [ ] Implement sign up function:

  ```typescript
  const signUp = async (credentials: SignupCredentials) => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.full_name,
        },
      },
    });
    return { data, error };
  };
  ```

- [ ] Implement sign in function:

  ```typescript
  const signIn = async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    return { data, error };
  };
  ```

- [ ] Implement magic link function:

  ```typescript
  const signInWithMagicLink = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    return { data, error };
  };
  ```

- [ ] Implement sign out function:
  ```typescript
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };
  ```

### 🔄 Session Management

- [ ] Implement session persistence with SecureStore:

  ```typescript
  import * as SecureStore from "expo-secure-store";

  const persistSession = async (session: any) => {
    if (session) {
      await SecureStore.setItemAsync("session", JSON.stringify(session));
    } else {
      await SecureStore.deleteItemAsync("session");
    }
  };
  ```

- [ ] Implement session restoration on app start
- [ ] Set up automatic session refresh

### 👤 User Profile Management

- [ ] Create `hooks/useProfile.ts`:

  ```typescript
  export const useProfile = () => {
    // Profile management hooks
  };
  ```

- [ ] Implement profile update function:
  ```typescript
  const updateProfile = async (updates: Partial<User>) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user?.id);
    return { data, error };
  };
  ```

### 🎨 Authentication UI Components

### 🔗 Account Linking on First Login (Shopify ↔ Supabase)

- [ ] After successful Supabase signup or login, run the linking routine:

  ```typescript
  // lib/linkShopify.ts
  import { shopifyClient } from "../lib/shopify";
  import { supabase } from "../lib/supabase";

  export async function linkShopifyAccount({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }) {
    // 1) Try to locate existing Shopify customer by email (Storefront API / project-specific)
    // 2) If found, acquire a customer access token (or reuse existing if you have it)
    // 3) If not found, create the customer via `customerCreate`
    // 4) Persist `shopify_customer_id` and `shopify_customer_access_token` in Supabase profiles
  }
  ```

- [ ] Implement Supabase Edge Function to find Shopify customer by email (Shopify Admin API)
- [ ] Add client utility to call the Edge Function (e.g., in `lib/customerApi.ts` or `lib/linkShopify.ts`)
- [ ] Ensure secure handling of Admin API credentials via Supabase function secrets
- [ ] Persist `shopify_customer_id` and `shopify_customer_access_token` in `profiles`

- [ ] Invoke linking after auth events:

  ```typescript
  // After signUp or signIn
  if (session?.user?.id && session.user.email) {
    await linkShopifyAccount({
      userId: session.user.id,
      email: session.user.email,
    });
  }
  ```

- [ ] Use stored `shopify_customer_access_token` for all customer-specific Shopify calls (orders, profile, etc.).

Notes:

- MVP can treat this as a soft sync you control. If a Shopify customer already exists for the email, you link it; otherwise you create it.
- Optionally allow "Sign in with Shopify" using `customerAccessTokenCreate` and then map the Shopify customer to the Supabase user.
- Storefront API cannot search customers by email; implement a Supabase Edge Function that uses the Shopify Admin API for email lookups, then perform linking and persistence from the app via that function.

- [ ] Create `components/auth/LoginForm.tsx`
- [ ] Create `components/auth/SignupForm.tsx`
- [ ] Create `components/auth/MagicLinkForm.tsx`
- [ ] Create `components/auth/ForgotPasswordForm.tsx`
- [ ] Create `components/auth/AuthProvider.tsx`

### 📱 Authentication Screens

- [ ] Create `app/auth/login.tsx`
- [ ] Create `app/auth/signup.tsx`
- [ ] Create `app/auth/forgot-password.tsx`
- [ ] Create `app/auth/verify-email.tsx`

### 🔒 Protected Routes

- [ ] Implement route protection logic
- [ ] Create authentication guard component
- [ ] Set up navigation flow for authenticated/unauthenticated users

### 🧪 Authentication Testing

- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test magic link flow
- [ ] Test session persistence
- [ ] Test profile updates
- [ ] Test sign out flow

## ✅ Phase 2 Completion Criteria

- [ ] Users can sign up with email/password
- [ ] Users can sign in with email/password
- [ ] Users can sign in with magic link
- [ ] Session persists across app restarts
- [ ] User profiles are created automatically
- [ ] Profile updates work correctly
- [ ] Protected routes are working
- [ ] Authentication UI is responsive and accessible
- [ ] On first login, Shopify customer is linked and identifiers are stored in Supabase
- [ ] All authentication flows are tested

## 🚀 Next Steps

After completing Phase 2:

1. Set up Shopify store and API access
2. Begin Phase 3: Shopify integration
3. Implement product data fetching

## 📝 Notes

- Test authentication on both iOS and Android
- Ensure proper error handling for all auth flows
- Verify RLS policies are working correctly
- Test session refresh functionality
- Ensure secure storage of sensitive data
