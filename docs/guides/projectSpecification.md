# Project Specification – React Native Clothing App with Shopify & Supabase

## 📘 Project Overview

This document outlines the technical and functional specification for a mobile ecommerce application developed using React Native, backed by Shopify for ecommerce functionality and Supabase for authentication and user data and Expo Push Notifications for user engagement.

The goal is to rapidly build and iterate on a performant, secure, and scalable MVP for a clothing retail mobile app, following modern best practices.

## 🎯 Scope & Objectives

- 📱 Deliver a cross-platform mobile app using React Native (Expo)
- 🛍️ Integrate Shopify Storefront API for products, cart, checkout, and customer data
- 🔐 Use Supabase Auth as the primary authentication provider
- 🔗 Seamlessly link Supabase user profiles with Shopify customers
- 🧠 Build scalable, modular architecture for long-term maintenance
- 🔔 Integrate push notifications using Expo

## 🧰 Tech Stack

| Layer          | Technology/Tool         | Purpose                              |
| -------------- | ----------------------- | ------------------------------------ |
| Frontend       | React Native (Expo)     | UI, Screens, Navigation              |
| State Mgmt     | React Context           | Local/global state management        |
| Auth           | Supabase Auth           | Email/password or magic link auth    |
| Backend        | Shopify Storefront API  | Ecommerce: Products, Orders, Cart    |
| Serverless     | Supabase Edge Functions | Shopify ↔ Supabase syncing logic     |
| Storage        | Supabase DB             | Profiles, Shopify tokens             |
| Secure Storage | Expo SecureStore        | Client-side token persistence        |
| Push Notify    | Expo Notifications      | User re-engagement                   |
| Serverless     | Supabase Edge Functions | Shopify-supabase sync, push triggers |

## UI & UX Goals

- ⚡ Instant onboarding with magic link or email/password
- 🎯 Minimal steps to get to shopping experience
- 🛒 Clean product browsing and cart flow
- 🧾 Seamless Shopify checkout experience
- 🔄 Auto-login with token restore
- 🛎️ Option to sign in using existing Shopify credentials

## Core Features

### Auth

- Supabase login/signup
- Session persistence
- Magic link support
- Link on first login: map Supabase user to Shopify customer and persist identifiers

### Shopify

- Product listing
- Single product query
- customerAccessTokenCreate mutation
- Customer create/link flow for account mapping

### Cart

- Local cart state (sync to Shopify on checkout)

### Profile

- Fetch & update user profile from Supabase
- Store Shopify customer ID/token

### Checkout

- Redirect to Shopify web checkout via Storefront API

## Project Description

This project is a modern, mobile-first shopping app built with React Native (Expo), TypeScript, and a modular architecture. The app provides a seamless shopping experience, allowing users to browse products, manage their cart, mark favorites, search, and handle user authentication. It integrates with Shopify Storefront API for product data and Supabase for authentication and user data management.

## Project Specification

### 1. Core Features

- Product browsing and search (from Shopify)
- Product details and images
- Add to cart, view cart, and checkout flow
- User authentication (Supabase)
- Favorites/wishlist management
- User profile management
- Responsive, themed UI with reusable components

### 2. Screens & Navigation

#### Tab Navigation (in app/(tabs)/)

- **Home/Shop (index.tsx or shop.tsx)**: Displays featured and all products, categories, and promotions.
- **Search (search.tsx)**: Allows users to search products by keyword or filter by category.
- **Cart (cart.tsx)**: Shows items in the cart, allows quantity updates, and proceeds to checkout.
- **Favorites (favorites.tsx)**: Displays user's favorite products.
- **Profile (profile.tsx)**: User account info, order history, and settings.

#### Product Details

- **Product Detail (product/[id].tsx)**: Shows detailed product info, images, price, add-to-cart, and favorite options.

#### Other Screens

- **Not Found (+not-found.tsx)**: Custom 404 for invalid routes.

### 3. Components

Located in components/:

- **ProductCard**: Displays product image, title, price, and quick actions.
- **Button**: Reusable button component.
- **LoadingSpinner**: For loading states.
- **HomeHeader, CommonHeader**: App and section headers.
- **ui/**: Icon and tab bar background components.

### 4. State Management

Located in store/:

- **authStore.ts**: Handles user authentication state (login, logout, session).
- **productStore.ts**: Manages product list, cart, favorites, and search state.

### 5. Hooks

Located in hooks/:

### 6. Constants

Located in constants/:

- **Colors.ts**: Centralized color palette.

### 7. Assets

Located in assets/:

- **fonts/**: Custom fonts.
- **images/**: App icons, splash, and product images.

### 8. Integrations

#### Shopify Storefront API

- Fetch product lists, details, images, and categories.
- Use GraphQL queries in lib/api.ts.
- Map Shopify product data to app's Product type.

#### Supabase

- User authentication (sign up, login, session management).
- Store user-specific data (favorites, order history, etc.).
- Integration code in lib/supabase.ts and store/authStore.ts.

## 🔐 Auth & Identity Flow

- **Primary source of identity**: Supabase Auth
- **Link on First Login**:

  1. User signs up or logs in with Supabase (email/password or magic link).
  2. App checks Shopify for a customer with the same email.
     - If found: store the Shopify `customerId` and a `customerAccessToken` in Supabase `profiles`.
     - If not found: create a Shopify customer and store the new identifiers.
  3. All customer-specific Shopify operations (orders, profile) use the stored access token.
  4. Optional: allow in-app Shopify login using `customerAccessTokenCreate` and link to the same Supabase user.

- **Sync logic via Supabase Edge Functions** (optional for MVP): encapsulate linking, token refresh/rotation, and push-trigger logic securely.
  - Note: Storefront API cannot search customers by email. Implement email lookup via a Supabase Edge Function using the Shopify Admin API, then link and persist `shopify_customer_id` and a `customerAccessToken` in Supabase.

## ☁️ Backend/API Flow

No traditional Node.js backend needed. All business logic handled by:

- Supabase Edge Functions (secure server-side)
- Shopify Storefront GraphQL API

## 🔔 Push Notification Integration

### Purpose

Engage users via:

- Order updates
- Promotional alerts
- Welcome messages
- Cart reminders

### Notification Flow

1. **Register device token on login**:

   - Call `Notifications.getExpoPushTokenAsync()` after Supabase login
   - Store token in Supabase profiles table

2. **Store Push Token in Supabase**:
   Schema update:

   ```sql
   ALTER TABLE profiles ADD COLUMN expo_push_token TEXT;
   ```

3. **Trigger Push Notifications**:
   - Use Supabase Edge Function to send a POST request to:
     `https://exp.host/--/api/v2/push/send`

### 9. Configuration

- **config.ts**: Stores API keys, endpoints, and environment variables for Shopify and Supabase.

### 10. Type Definitions

- **type.ts**: TypeScript interfaces for products, users, cart items, etc.

## Summary

This project is a scalable, maintainable shopping app with a clean architecture, leveraging Shopify for e-commerce data and Supabase for authentication and user data. The codebase is organized for easy extension, theming, and component reuse.
