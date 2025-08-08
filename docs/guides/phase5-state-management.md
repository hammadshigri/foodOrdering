# Phase 5: State Management & Cart

## 🎯 Phase Overview

Implement comprehensive state management for the shopping cart, user preferences, and app-wide state using React Context and local storage.

## 📋 Phase 5 Checklist

### 🛒 Cart State Management

#### 🗄️ Cart Types

- [ ] Create `types/cart.ts`:

  ```typescript
  export interface CartItem {
    id: string;
    productId: string;
    variantId: string;
    title: string;
    price: Money;
    quantity: number;
    image: string;
    selectedOptions: SelectedOption[];
  }

  export interface CartState {
    items: CartItem[];
    total: Money;
    itemCount: number;
    loading: boolean;
    error: string | null;
  }

  export interface CartActions {
    addItem: (item: Omit<CartItem, "id">) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    loadCart: () => void;
    saveCart: () => void;
  }
  ```

#### 🏪 Cart Store

- [ ] Create `store/cartStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer, useEffect } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { CartState, CartItem, CartActions } from "../types/cart";

  // Cart reducer implementation
  const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
      case "ADD_ITEM":
      // Add item logic
      case "REMOVE_ITEM":
      // Remove item logic
      case "UPDATE_QUANTITY":
      // Update quantity logic
      case "CLEAR_CART":
      // Clear cart logic
      case "LOAD_CART":
      // Load cart logic
      default:
        return state;
    }
  };

  // Cart context and provider
  ```

#### 💾 Cart Persistence

- [ ] Implement AsyncStorage for cart persistence:

  ```typescript
  const CART_STORAGE_KEY = "@cart_items";

  const saveCartToStorage = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const loadCartFromStorage = async (): Promise<CartItem[]> => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  };
  ```

### ❤️ Favorites State Management

#### 🗄️ Favorites Types

- [ ] Create `types/favorites.ts`:

  ```typescript
  export interface FavoriteItem {
    id: string;
    productId: string;
    title: string;
    price: Money;
    image: string;
    addedAt: Date;
  }

  export interface FavoritesState {
    items: FavoriteItem[];
    loading: boolean;
    error: string | null;
  }
  ```

#### 🏪 Favorites Store

- [ ] Create `store/favoritesStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer, useEffect } from "react";
  import { supabase } from "../lib/supabase";
  import { FavoritesState, FavoriteItem } from "../types/favorites";

  // Favorites reducer and context implementation
  ```

#### 🔄 Favorites Sync

- [ ] Implement Supabase sync for favorites:
  ```typescript
  const syncFavoritesWithSupabase = async (
    userId: string,
    favorites: FavoriteItem[]
  ) => {
    try {
      const { error } = await supabase.from("user_favorites").upsert(
        favorites.map((fav) => ({
          user_id: userId,
          product_id: fav.productId,
          added_at: fav.addedAt.toISOString(),
        }))
      );
      return { error };
    } catch (error) {
      return { error };
    }
  };
  ```

### 🔍 Search State Management

#### 🗄️ Search Types

- [ ] Create `types/search.ts`:

  ```typescript
  export interface SearchFilters {
    category?: string;
    priceRange?: {
      min: number;
      max: number;
    };
    sortBy?: "price" | "name" | "date";
    sortOrder?: "asc" | "desc";
  }

  export interface SearchState {
    query: string;
    filters: SearchFilters;
    results: Product[];
    history: string[];
    loading: boolean;
    error: string | null;
  }
  ```

#### 🏪 Search Store

- [ ] Create `store/searchStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer } from "react";
  import { SearchState, SearchFilters } from "../types/search";

  // Search reducer and context implementation
  ```

### 🎨 App Preferences State

#### 🗄️ Preferences Types

- [ ] Create `types/preferences.ts`:
  ```typescript
  export interface AppPreferences {
    theme: "light" | "dark" | "system";
    currency: string;
    language: string;
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
      cartReminders: boolean;
    };
    display: {
      showPrices: boolean;
      showStock: boolean;
      gridView: boolean;
    };
  }
  ```

#### 🏪 Preferences Store

- [ ] Create `store/preferencesStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer, useEffect } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { AppPreferences } from "../types/preferences";

  // Preferences reducer and context implementation
  ```

### 🔄 Global State Management

#### 🏪 App Store

- [ ] Create `store/appStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer } from "react";

  interface AppState {
    isOnline: boolean;
    isLoading: boolean;
    error: string | null;
    currentRoute: string;
  }

  // App-wide state management
  ```

#### 🔗 Store Integration

- [ ] Create `store/index.ts`:

  ```typescript
  import { CartProvider } from "./cartStore";
  import { FavoritesProvider } from "./favoritesStore";
  import { SearchProvider } from "./searchStore";
  import { PreferencesProvider } from "./preferencesStore";
  import { AppProvider } from "./appStore";

  export const StoreProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <AppProvider>
        <PreferencesProvider>
          <CartProvider>
            <FavoritesProvider>
              <SearchProvider>{children}</SearchProvider>
            </FavoritesProvider>
          </CartProvider>
        </PreferencesProvider>
      </AppProvider>
    );
  };
  ```

### 🛒 Cart Functionality

#### 🧩 Cart Components

- [ ] Create `components/cart/CartItem.tsx`:

  ```typescript
  interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
  }
  ```

- [ ] Create `components/cart/CartSummary.tsx`:

  ```typescript
  interface CartSummaryProps {
    items: CartItem[];
    total: Money;
    onCheckout: () => void;
  }
  ```

- [ ] Create `components/cart/QuantitySelector.tsx`:
  ```typescript
  interface QuantitySelectorProps {
    quantity: number;
    maxQuantity?: number;
    onQuantityChange: (quantity: number) => void;
  }
  ```

#### 🔄 Cart Actions

- [ ] Implement add to cart functionality:

  ```typescript
  const addToCart = (
    product: Product,
    variant: ProductVariant,
    quantity: number = 1
  ) => {
    const cartItem: Omit<CartItem, "id"> = {
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      price: variant.price,
      quantity,
      image: product.images[0]?.url || "",
      selectedOptions: variant.selectedOptions,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });
  };
  ```

- [ ] Implement remove from cart:

  ```typescript
  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };
  ```

- [ ] Implement update quantity:
  ```typescript
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
    }
  };
  ```

### ❤️ Favorites Functionality

#### 🧩 Favorites Components

- [ ] Create `components/favorites/FavoriteItem.tsx`
- [ ] Create `components/favorites/FavoritesGrid.tsx`
- [ ] Create `components/favorites/AddToFavorites.tsx`

#### 🔄 Favorites Actions

- [ ] Implement add to favorites:

  ```typescript
  const addToFavorites = async (product: Product) => {
    const favoriteItem: Omit<FavoriteItem, "id"> = {
      productId: product.id,
      title: product.title,
      price: product.priceRange.minVariantPrice,
      image: product.images[0]?.url || "",
      addedAt: new Date(),
    };

    dispatch({ type: "ADD_FAVORITE", payload: favoriteItem });

    // Sync with Supabase
    if (user) {
      await syncFavoritesWithSupabase(user.id, [...favorites, favoriteItem]);
    }
  };
  ```

- [ ] Implement remove from favorites:

  ```typescript
  const removeFromFavorites = async (productId: string) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: productId });

    // Sync with Supabase
    if (user) {
      const updatedFavorites = favorites.filter(
        (fav) => fav.productId !== productId
      );
      await syncFavoritesWithSupabase(user.id, updatedFavorites);
    }
  };
  ```

### 🔍 Search Functionality

#### 🔄 Search Actions

- [ ] Implement search with debouncing:

  ```typescript
  const searchProducts = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        dispatch({ type: "CLEAR_RESULTS" });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const { data, error } = await searchProductsAPI(query);

        if (error) {
          dispatch({ type: "SET_ERROR", payload: error.message });
        } else {
          dispatch({ type: "SET_RESULTS", payload: data });
          dispatch({ type: "ADD_TO_HISTORY", payload: query });
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Search failed" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 300),
    []
  );
  ```

### 🎨 Preferences Management

#### 🔄 Preferences Actions

- [ ] Implement theme switching:

  ```typescript
  const setTheme = async (theme: "light" | "dark" | "system") => {
    dispatch({ type: "SET_THEME", payload: theme });
    await AsyncStorage.setItem("@theme", theme);
  };
  ```

- [ ] Implement currency switching:
  ```typescript
  const setCurrency = async (currency: string) => {
    dispatch({ type: "SET_CURRENCY", payload: currency });
    await AsyncStorage.setItem("@currency", currency);
  };
  ```

### 🧪 Testing

#### 🧪 State Management Testing

- [ ] Test cart operations (add, remove, update)
- [ ] Test favorites operations
- [ ] Test search functionality
- [ ] Test preferences persistence
- [ ] Test state synchronization

#### 🔄 Integration Testing

- [ ] Test cart-favorites integration
- [ ] Test search-cart integration
- [ ] Test preferences-app integration
- [ ] Test offline functionality

## ✅ Phase 5 Completion Criteria

- [ ] Cart state management is functional
- [ ] Favorites state management is functional
- [ ] Search state management is functional
- [ ] Preferences state management is functional
- [ ] All state is properly persisted
- [ ] State synchronization works correctly
- [ ] Cart calculations are accurate
- [ ] Favorites sync with Supabase
- [ ] Search history is maintained
- [ ] Preferences are saved locally

## 🚀 Next Steps

After completing Phase 5:

1. Begin Phase 6: Push notifications
2. Implement checkout flow
3. Add order management

## 📝 Notes

- Ensure proper error handling in all state operations
- Test state persistence across app restarts
- Verify state synchronization with backend
- Implement proper loading states
- Test offline functionality
- Ensure state consistency across components
