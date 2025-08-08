# Phase 7: Testing & Optimization

## 🎯 Phase Overview

Comprehensive testing of all app features, performance optimization, and quality assurance to ensure the app is production-ready.

## 📋 Phase 7 Checklist

### 🧪 Testing Setup

#### 📦 Testing Dependencies

- [ ] Install testing dependencies:
  ```bash
  npm install --save-dev jest
  npm install --save-dev @testing-library/react-native
  npm install --save-dev @testing-library/jest-native
  npm install --save-dev react-native-testing-library
  npm install --save-dev @types/jest
  npm install --save-dev jest-expo
  ```

#### ⚙️ Jest Configuration

- [ ] Create `jest.config.js`:
  ```javascript
  module.exports = {
    preset: "jest-expo",
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
    transformIgnorePatterns: [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
    ],
    collectCoverageFrom: [
      "**/*.{ts,tsx}",
      "!**/coverage/**",
      "!**/node_modules/**",
      "!**/babel.config.js",
      "!**/jest.setup.js",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  };
  ```

### 🧩 Component Testing

#### 🎨 UI Component Tests

- [ ] Test `components/ui/Button.tsx`:

  ```typescript
  import { render, fireEvent } from "@testing-library/react-native";
  import { Button } from "../Button";

  describe("Button", () => {
    it("renders correctly", () => {
      const { getByText } = render(
        <Button title="Test Button" onPress={() => {}} />
      );
      expect(getByText("Test Button")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Test Button" onPress={onPress} />
      );

      fireEvent.press(getByText("Test Button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("disables when disabled prop is true", () => {
      const { getByText } = render(
        <Button title="Test Button" onPress={() => {}} disabled={true} />
      );

      const button = getByText("Test Button");
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });
  ```

- [ ] Test `components/product/ProductCard.tsx`
- [ ] Test `components/cart/CartItem.tsx`
- [ ] Test `components/auth/LoginForm.tsx`
- [ ] Test `components/search/SearchInput.tsx`

#### 🔄 State Management Tests

- [ ] Test cart store:

  ```typescript
  import { renderHook, act } from "@testing-library/react-hooks";
  import { useCart } from "../store/cartStore";

  describe("Cart Store", () => {
    it("adds item to cart", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addItem({
          productId: "1",
          variantId: "1",
          title: "Test Product",
          price: { amount: "10.00", currencyCode: "USD" },
          quantity: 1,
          image: "test.jpg",
          selectedOptions: [],
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.itemCount).toBe(1);
    });

    it("removes item from cart", () => {
      const { result } = renderHook(() => useCart());

      // Add item first
      act(() => {
        result.current.addItem({
          productId: "1",
          variantId: "1",
          title: "Test Product",
          price: { amount: "10.00", currencyCode: "USD" },
          quantity: 1,
          image: "test.jpg",
          selectedOptions: [],
        });
      });

      // Remove item
      act(() => {
        result.current.removeItem(result.current.items[0].id);
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.itemCount).toBe(0);
    });
  });
  ```

- [ ] Test auth store
- [ ] Test favorites store
- [ ] Test search store
- [ ] Test preferences store

### 🔗 Integration Testing

#### 🔐 Authentication Flow Tests

- [ ] Test sign up flow:

  ```typescript
  import { render, fireEvent, waitFor } from "@testing-library/react-native";
  import { SignupForm } from "../components/auth/SignupForm";

  describe("Signup Flow", () => {
    it("submits signup form with valid data", async () => {
      const onSignup = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <SignupForm onSignup={onSignup} />
      );

      fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
      fireEvent.changeText(getByPlaceholderText("Password"), "password123");
      fireEvent.changeText(getByPlaceholderText("Full Name"), "Test User");

      fireEvent.press(getByText("Sign Up"));

      await waitFor(() => {
        expect(onSignup).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          full_name: "Test User",
        });
      });
    });
  });
  ```

- [ ] Test sign in flow
- [ ] Test password reset flow
- [ ] Test session persistence

#### 🛍️ Shopping Flow Tests

- [ ] Test product browsing:

  ```typescript
  describe("Product Browsing", () => {
    it("loads products from Shopify", async () => {
      const { getByText, findByText } = render(<ProductList />);

      // Wait for products to load
      await findByText("Test Product");

      expect(getByText("Test Product")).toBeTruthy();
    });

    it("navigates to product detail", async () => {
      const mockNavigation = { navigate: jest.fn() };
      const { getByText } = render(
        <ProductCard product={mockProduct} navigation={mockNavigation} />
      );

      fireEvent.press(getByText("Test Product"));

      expect(mockNavigation.navigate).toHaveBeenCalledWith("ProductDetail", {
        handle: "test-product",
      });
    });
  });
  ```

- [ ] Test add to cart flow
- [ ] Test checkout flow
- [ ] Test favorites functionality

#### 🔍 Search Functionality Tests

- [ ] Test search with results:

  ```typescript
  describe("Search Functionality", () => {
    it("searches products successfully", async () => {
      const { getByPlaceholderText, findByText } = render(<SearchScreen />);

      const searchInput = getByPlaceholderText("Search products...");
      fireEvent.changeText(searchInput, "shirt");

      await findByText("Blue T-Shirt");
      expect(getByText("Blue T-Shirt")).toBeTruthy();
    });

    it("shows no results message", async () => {
      const { getByPlaceholderText, findByText } = render(<SearchScreen />);

      const searchInput = getByPlaceholderText("Search products...");
      fireEvent.changeText(searchInput, "nonexistent");

      await findByText("No products found");
    });
  });
  ```

### 📱 Navigation Testing

#### 🧭 Navigation Flow Tests

- [ ] Test tab navigation:

  ```typescript
  import { render, fireEvent } from "@testing-library/react-native";
  import { NavigationContainer } from "@react-navigation/native";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

  describe("Tab Navigation", () => {
    it("navigates between tabs", () => {
      const Tab = createBottomTabNavigator();
      const { getByText } = render(
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      fireEvent.press(getByText("Cart"));
      expect(getByText("Your Cart")).toBeTruthy();
    });
  });
  ```

- [ ] Test stack navigation
- [ ] Test deep linking
- [ ] Test navigation state persistence

### 🔔 Push Notification Testing

#### 📱 Notification Tests

- [ ] Test notification permissions:

  ```typescript
  import * as Notifications from "expo-notifications";
  import { registerForPushNotificationsAsync } from "../lib/notifications";

  describe("Push Notifications", () => {
    it("requests notification permissions", async () => {
      const mockGetPermissionsAsync = jest.spyOn(
        Notifications,
        "getPermissionsAsync"
      );
      const mockRequestPermissionsAsync = jest.spyOn(
        Notifications,
        "requestPermissionsAsync"
      );

      mockGetPermissionsAsync.mockResolvedValue({ status: "undetermined" });
      mockRequestPermissionsAsync.mockResolvedValue({ status: "granted" });

      await registerForPushNotificationsAsync();

      expect(mockRequestPermissionsAsync).toHaveBeenCalled();
    });
  });
  ```

- [ ] Test notification sending
- [ ] Test notification handling
- [ ] Test notification preferences

### ⚡ Performance Testing

#### 📊 Performance Metrics

- [ ] Test app startup time:

  ```typescript
  import { performance } from "react-native-performance";

  describe("App Performance", () => {
    it("starts up within acceptable time", async () => {
      const startTime = performance.now();

      // Simulate app startup
      await render(<App />);

      const endTime = performance.now();
      const startupTime = endTime - startTime;

      expect(startupTime).toBeLessThan(3000); // 3 seconds
    });
  });
  ```

- [ ] Test image loading performance
- [ ] Test list rendering performance
- [ ] Test memory usage
- [ ] Test battery usage

#### 🖼️ Image Optimization Tests

- [ ] Test image caching:

  ```typescript
  describe("Image Optimization", () => {
    it("caches images properly", async () => {
      const { getByTestId } = render(<ProductImage source="test.jpg" />);

      const image = getByTestId("product-image");

      // Wait for image to load
      await waitFor(() => {
        expect(image.props.source.uri).toBe("test.jpg");
      });
    });
  });
  ```

### 🧪 API Testing

#### 🔗 Shopify API Tests

- [ ] Test product fetching:

  ```typescript
  import { fetchProducts } from "../lib/productApi";

  describe("Shopify API", () => {
    it("fetches products successfully", async () => {
      const { data, error } = await fetchProducts(10);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.edges).toHaveLength(10);
    });

    it("handles API errors gracefully", async () => {
      // Mock API error
      const { data, error } = await fetchProducts(10);

      expect(data).toBeNull();
      expect(error).toBeDefined();
    });
  });
  ```

- [ ] Test product search
- [ ] Test product detail fetching
- [ ] Test checkout flow

#### 🔐 Supabase API Tests

- [ ] Test authentication:

  ```typescript
  import { supabase } from "../lib/supabase";

  describe("Supabase Auth", () => {
    it("signs up user successfully", async () => {
      const { data, error } = await supabase.auth.signUp({
        email: "test@example.com",
        password: "password123",
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
    });
  });
  ```

- [ ] Test user profile management
- [ ] Test favorites sync
- [ ] Test notification preferences

### 🎯 User Experience Testing

#### ♿ Accessibility Testing

- [ ] Test screen reader support:

  ```typescript
  import { AccessibilityInfo } from "react-native";

  describe("Accessibility", () => {
    it("has proper accessibility labels", () => {
      const { getByLabelText } = render(<Button title="Test" />);

      expect(getByLabelText("Test Button")).toBeTruthy();
    });

    it("supports screen readers", () => {
      const mockAnnounceForAccessibility = jest.spyOn(
        AccessibilityInfo,
        "announceForAccessibility"
      );

      // Trigger accessibility announcement
      fireEvent.press(getByText("Important Action"));

      expect(mockAnnounceForAccessibility).toHaveBeenCalled();
    });
  });
  ```

- [ ] Test keyboard navigation
- [ ] Test color contrast
- [ ] Test font scaling

#### 📱 Device Testing

- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices
- [ ] Test different screen sizes
- [ ] Test orientation changes

### 🔧 Error Handling Testing

#### ❌ Error Boundary Tests

- [ ] Test error boundaries:

  ```typescript
  describe("Error Boundaries", () => {
    it("catches and displays errors gracefully", () => {
      const ThrowError = () => {
        throw new Error("Test error");
      };

      const { getByText } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(getByText("Something went wrong")).toBeTruthy();
    });
  });
  ```

- [ ] Test network error handling
- [ ] Test API error handling
- [ ] Test validation errors

### 📊 Coverage Testing

#### 📈 Code Coverage

- [ ] Set up coverage reporting:

  ```javascript
  // jest.config.js
  module.exports = {
    // ... other config
    collectCoverage: true,
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  };
  ```

- [ ] Generate coverage reports
- [ ] Monitor coverage trends
- [ ] Set up coverage alerts

### 🚀 Performance Optimization

#### ⚡ Optimization Techniques

- [ ] Implement lazy loading:

  ```typescript
  const LazyComponent = React.lazy(() => import("./HeavyComponent"));

  const App = () => (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
  ```

- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Optimize images
- [ ] Implement virtual scrolling

#### 🔄 State Optimization

- [ ] Optimize re-renders:

  ```typescript
  const MemoizedComponent = React.memo(({ data }) => {
    return <ProductCard product={data} />;
  });
  ```

- [ ] Implement proper memoization
- [ ] Optimize context usage
- [ ] Reduce unnecessary re-renders

## ✅ Phase 7 Completion Criteria

- [ ] All components have unit tests
- [ ] All integration flows are tested
- [ ] Performance meets requirements
- [ ] Accessibility standards are met
- [ ] Error handling is comprehensive
- [ ] Code coverage is above 80%
- [ ] App works on all target devices
- [ ] No critical bugs remain
- [ ] Performance is optimized
- [ ] User experience is polished

## 🚀 Next Steps

After completing Phase 7:

1. Begin Phase 8: Deployment and launch
2. Set up monitoring and analytics
3. Prepare for app store submission

## 📝 Notes

- Run tests before each commit
- Monitor performance metrics continuously
- Test on real devices regularly
- Keep test coverage high
- Document any known issues
- Set up automated testing pipeline
