# Phase 1: Project Setup & Foundation

## 🎯 Phase Overview

Set up the basic project structure, install dependencies, and configure the development environment for the React Native clothing app.

## 📋 Phase 1 Checklist

### 🔧 Development Environment Setup

- [x] Install Node.js (v18 or higher)
- [x] Install Expo CLI globally: `npm install -g @expo/cli`
- [x] Install React Native CLI (optional): `npm install -g react-native-cli`
- [x] Set up Android Studio (for Android development)
- [x] Set up Xcode (for iOS development, macOS only)
- [x] Install Git and configure

### 🏗️ Project Structure Setup

- [x] Create new Expo project: `npx create-expo-app@latest clothing-app --template`
- [x] Navigate to project directory
- [x] Initialize Git repository
- [x] Create folder structure:
  ```
  clothing-app/
  ├── app/
  ├── components/
  ├── constants/
  ├── hooks/
  ├── lib/
  ├── store/
  ├── types/
  ├── assets/
  └── docs/
  ```

### 📦 Dependencies Installation

#### ✅ Already Installed (Core Dependencies)

- [x] Install core dependencies:
  ```bash
  # Already installed:
  expo: "~53.0.20"
  expo-router: "~5.1.4"
  expo-font: "~13.3.2"
  expo-splash-screen: "~0.30.10"
  expo-status-bar: "~2.2.3"
  expo-system-ui: "~5.0.10"
  expo-web-browser: "~14.2.0"
  expo-linking: "~7.1.7"
  react: "19.0.0"
  react-native: "0.79.5"
  react-native-reanimated: "~3.17.4"
  react-native-safe-area-context: "5.4.0"
  react-native-screens: "~4.11.1"
  @react-navigation/native: "^7.1.6"
  ```

#### ✅ Already Installed (UI and Navigation Dependencies)

- [x] Install UI and navigation dependencies:
  ```bash
  # Already installed:
  @react-navigation/native: "^7.1.6"
  react-native-screens: "~4.11.1"
  react-native-safe-area-context: "5.4.0"
  react-native-reanimated: "~3.17.4"
  ```

#### ✅ Already Installed (Development Dependencies)

- [x] Install development dependencies:
  ```bash
  # Already installed:
  @types/react: "~19.0.10"
  typescript: "~5.8.3"
  @babel/core: "^7.25.2"
  jest: "^29.2.1"
  jest-expo: "~53.0.9"
  react-test-renderer: "19.0.0"
  ```

#### ✅ Missing Dependencies (Now Installed)

- [x] Install Supabase dependencies:

  ```bash
  npm install @supabase/supabase-js
  ```

- [x] Install secure storage:

  ```bash
  npm install expo-secure-store
  ```

- [x] Install notification dependencies:

  ```bash
  npm install expo-notifications
  npm install expo-device
  npm install expo-constants
  ```

- [x] Install additional Expo packages:

  ```bash
  npm install expo-auth-session
  npm install expo-crypto
  ```

- [x] Install GraphQL for Shopify:

  ```bash
  npm install graphql
  npm install graphql-request
  ```

- [x] Install local storage:

  ```bash
  npm install @react-native-async-storage/async-storage
  ```

- [x] Install additional navigation packages:
  ```bash
  npm install @react-navigation/bottom-tabs
  npm install @react-navigation/stack
  npm install react-native-gesture-handler
  ```

### ⚙️ Configuration Files

- [x] Create `app.config.js` for Expo configuration (using app.json)
- [x] Create `babel.config.js` for Babel configuration
- [x] Create `metro.config.js` for Metro bundler
- [x] Create `tsconfig.json` for TypeScript configuration
- [x] Create `.env` file for environment variables
- [x] Create `.gitignore` file
- [x] Create `README.md` with project documentation

### 🔐 Environment Variables Setup

- [x] Create `.env` file with placeholders:
  ```
  EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN=your_shopify_store.myshopify.com
  EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
  EXPO_PUBLIC_EXPO_PUSH_TOKEN=your_expo_push_token
  ```

### 🎨 Basic Styling Setup

- [x] Create `constants/Colors.ts` with color palette
- [x] Create `constants/Sizes.ts` with spacing and sizing
- [x] Create `constants/Fonts.ts` with typography
- [x] Set up basic theme configuration

### 📱 Basic App Structure

- [x] Set up basic navigation structure in `app/_layout.tsx`
- [ ] Create placeholder screens for all tabs
- [ ] Set up basic tab navigation
- [x] Configure splash screen and app icons

### 🧪 Testing Setup

- [x] Install testing dependencies:
  ```bash
  # Already installed:
  jest: "^29.2.1"
  jest-expo: "~53.0.9"
  react-test-renderer: "19.0.0"
  ```
- [x] Create `jest.config.js`
- [ ] Set up basic test structure

### 📚 Documentation

- [x] Create `docs/README.md` with project overview
- [x] Document folder structure
- [ ] Create development guidelines
- [ ] Set up API documentation structure

## ✅ Phase 1 Completion Criteria

- [x] Project runs without errors: `npx expo start`
- [x] All dependencies are installed and working
- [ ] Basic navigation structure is in place
- [x] Environment variables are configured
- [x] TypeScript is properly configured
- [x] Basic styling system is set up
- [x] Testing framework is configured
- [x] Documentation is in place

## 🚀 Next Steps

After completing Phase 1:

1. Set up Supabase project (Phase 2 preparation)
2. Set up Shopify store (Phase 3 preparation)
3. Begin Phase 2: Authentication implementation

## 📝 Notes

- Ensure all Expo SDK versions are compatible
- Test on both iOS simulator and Android emulator
- Verify TypeScript compilation works correctly
- Check that all navigation dependencies are properly linked
