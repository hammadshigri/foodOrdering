# Phase 6: Push Notifications

## 🎯 Phase Overview

Implement Expo push notifications for user engagement, including order updates, promotional alerts, welcome messages, and cart reminders.

## 📋 Phase 6 Checklist

### 📦 Notification Dependencies

- [ ] Install notification dependencies:
  ```bash
  npm install expo-notifications
  npm install expo-device
  npm install expo-constants
  ```

### 🔧 Notification Setup

#### 📱 Notification Configuration

- [ ] Update `app.config.js` for notification settings:
  ```javascript
  export default {
    expo: {
      // ... other config
      plugins: [
        [
          "expo-notifications",
          {
            icon: "./assets/notification-icon.png",
            color: "#ffffff",
            sounds: ["./assets/notification-sound.wav"],
          },
        ],
      ],
    },
  };
  ```

#### 🔐 Notification Permissions

- [ ] Create `lib/notifications.ts`:

  ```typescript
  import * as Notifications from "expo-notifications";
  import * as Device from "expo-device";
  import { Platform } from "react-native";

  // Configure notification behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Request permissions
  export const registerForPushNotificationsAsync = async () => {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };
  ```

### 🗄️ Database Schema Updates

#### 📊 Supabase Schema

- [ ] Update profiles table to include push token:

  ```sql
  ALTER TABLE profiles ADD COLUMN expo_push_token TEXT;
  ALTER TABLE profiles ADD COLUMN notification_preferences JSONB DEFAULT '{}';
  ```

- [ ] Create notification preferences table:

  ```sql
  CREATE TABLE notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_updates BOOLEAN DEFAULT true,
    promotions BOOLEAN DEFAULT true,
    cart_reminders BOOLEAN DEFAULT true,
    welcome_messages BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Users can view own notification preferences" ON notification_preferences
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Users can update own notification preferences" ON notification_preferences
    FOR UPDATE USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own notification preferences" ON notification_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```

### 🔄 Token Management

#### 💾 Token Storage

- [ ] Create `hooks/usePushToken.ts`:

  ```typescript
  import { useState, useEffect } from "react";
  import { registerForPushNotificationsAsync } from "../lib/notifications";
  import { supabase } from "../lib/supabase";
  import { useAuth } from "../store/authStore";

  export const usePushToken = () => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
      const getToken = async () => {
        try {
          const expoToken = await registerForPushNotificationsAsync();
          if (expoToken) {
            setToken(expoToken);

            // Save token to Supabase if user is logged in
            if (user) {
              await saveTokenToSupabase(user.id, expoToken);
            }
          }
        } catch (error) {
          console.error("Error getting push token:", error);
        } finally {
          setLoading(false);
        }
      };

      getToken();
    }, [user]);

    return { token, loading };
  };

  const saveTokenToSupabase = async (userId: string, token: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ expo_push_token: token })
        .eq("id", userId);

      if (error) {
        console.error("Error saving push token:", error);
      }
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  };
  ```

### 🏪 Notification Store

#### 🗄️ Notification Types

- [ ] Create `types/notifications.ts`:

  ```typescript
  export interface NotificationPreferences {
    orderUpdates: boolean;
    promotions: boolean;
    cartReminders: boolean;
    welcomeMessages: boolean;
  }

  export interface NotificationData {
    type: "order_update" | "promotion" | "cart_reminder" | "welcome";
    title: string;
    body: string;
    data?: Record<string, any>;
  }

  export interface NotificationState {
    preferences: NotificationPreferences;
    loading: boolean;
    error: string | null;
  }
  ```

#### 🏪 Notification Store

- [ ] Create `store/notificationStore.ts`:

  ```typescript
  import { createContext, useContext, useReducer, useEffect } from "react";
  import { supabase } from "../lib/supabase";
  import {
    NotificationState,
    NotificationPreferences,
  } from "../types/notifications";

  // Notification reducer and context implementation
  ```

### 🔔 Notification Triggers

#### 📧 Welcome Notifications

- [ ] Create welcome notification function:

  ```typescript
  export const sendWelcomeNotification = async (
    userId: string,
    userName: string
  ) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("expo_push_token, notification_preferences")
        .eq("id", userId)
        .single();

      if (
        profile?.expo_push_token &&
        profile.notification_preferences?.welcomeMessages
      ) {
        await sendPushNotification({
          to: profile.expo_push_token,
          title: "Welcome to Our Store!",
          body: `Hi ${userName}, welcome to our clothing store! Start exploring our latest collection.`,
          data: { type: "welcome" },
        });
      }
    } catch (error) {
      console.error("Error sending welcome notification:", error);
    }
  };
  ```

#### 🛒 Cart Reminder Notifications

- [ ] Create cart reminder function:

  ```typescript
  export const sendCartReminderNotification = async (
    userId: string,
    cartItems: CartItem[]
  ) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("expo_push_token, notification_preferences")
        .eq("id", userId)
        .single();

      if (
        profile?.expo_push_token &&
        profile.notification_preferences?.cartReminders
      ) {
        const itemCount = cartItems.length;
        const total = calculateCartTotal(cartItems);

        await sendPushNotification({
          to: profile.expo_push_token,
          title: "Items in Your Cart",
          body: `You have ${itemCount} items in your cart worth $${total}. Complete your purchase!`,
          data: { type: "cart_reminder", cartItems },
        });
      }
    } catch (error) {
      console.error("Error sending cart reminder:", error);
    }
  };
  ```

#### 📦 Order Update Notifications

- [ ] Create order update function:

  ```typescript
  export const sendOrderUpdateNotification = async (
    userId: string,
    orderId: string,
    status: string,
    orderDetails: any
  ) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("expo_push_token, notification_preferences")
        .eq("id", userId)
        .single();

      if (
        profile?.expo_push_token &&
        profile.notification_preferences?.orderUpdates
      ) {
        const statusMessages = {
          confirmed: "Your order has been confirmed!",
          shipped: "Your order has been shipped!",
          delivered: "Your order has been delivered!",
          cancelled: "Your order has been cancelled.",
        };

        await sendPushNotification({
          to: profile.expo_push_token,
          title: "Order Update",
          body: statusMessages[status] || `Your order status: ${status}`,
          data: { type: "order_update", orderId, status, orderDetails },
        });
      }
    } catch (error) {
      console.error("Error sending order update notification:", error);
    }
  };
  ```

#### 🎉 Promotional Notifications

- [ ] Create promotional notification function:

  ```typescript
  export const sendPromotionalNotification = async (
    userId: string,
    promotion: {
      title: string;
      message: string;
      discount: string;
      expiryDate: string;
    }
  ) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("expo_push_token, notification_preferences")
        .eq("id", userId)
        .single();

      if (
        profile?.expo_push_token &&
        profile.notification_preferences?.promotions
      ) {
        await sendPushNotification({
          to: profile.expo_push_token,
          title: promotion.title,
          body: `${promotion.message} ${promotion.discount} off! Valid until ${promotion.expiryDate}.`,
          data: { type: "promotion", promotion },
        });
      }
    } catch (error) {
      console.error("Error sending promotional notification:", error);
    }
  };
  ```

### 🚀 Push Notification Service

#### 📤 Send Notifications

- [ ] Create `lib/pushNotificationService.ts`:

  ```typescript
  interface PushNotificationPayload {
    to: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    sound?: "default" | null;
    badge?: number;
  }

  export const sendPushNotification = async (
    payload: PushNotificationPayload
  ) => {
    try {
      const message = {
        to: payload.to,
        sound: payload.sound || "default",
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        badge: payload.badge,
      };

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.message || "Failed to send notification"
        );
      }

      return result;
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw error;
    }
  };
  ```

### 🎨 Notification UI Components

#### ⚙️ Notification Settings

- [ ] Create `components/notifications/NotificationSettings.tsx`:
  ```typescript
  interface NotificationSettingsProps {
    preferences: NotificationPreferences;
    onPreferenceChange: (
      key: keyof NotificationPreferences,
      value: boolean
    ) => void;
  }
  ```

#### 📱 Notification Handler

- [ ] Create `components/notifications/NotificationHandler.tsx`:

  ```typescript
  import { useEffect, useRef } from "react";
  import * as Notifications from "expo-notifications";
  import { useNavigation } from "@react-navigation/native";

  export const NotificationHandler = () => {
    const navigation = useNavigation();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
      // Handle notification received
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notification received:", notification);
        });

      // Handle notification response (user tapped)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data;

          // Navigate based on notification type
          switch (data.type) {
            case "order_update":
              navigation.navigate("Profile", { screen: "OrderHistory" });
              break;
            case "cart_reminder":
              navigation.navigate("Cart");
              break;
            case "promotion":
              navigation.navigate("Home");
              break;
            default:
              break;
          }
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, [navigation]);

    return null;
  };
  ```

### 🔄 Supabase Edge Functions

#### 🏪 Notification Triggers

- [ ] Create Supabase Edge Function for notifications:

  ```typescript
  // supabase/functions/send-notification/index.ts
  import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  serve(async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    try {
      const { userId, notificationType, data } = await req.json();

      // Get user's push token and preferences
      const { data: profile } = await supabase
        .from("profiles")
        .select("expo_push_token, notification_preferences")
        .eq("id", userId)
        .single();

      if (!profile?.expo_push_token) {
        return new Response(JSON.stringify({ error: "No push token found" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Send notification based on type
      const notification = createNotification(notificationType, data);

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: profile.expo_push_token,
          title: notification.title,
          body: notification.body,
          data: notification.data,
        }),
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  });
  ```

### 🧪 Testing

#### 🧪 Notification Testing

- [ ] Test notification permissions
- [ ] Test token generation and storage
- [ ] Test notification sending
- [ ] Test notification handling
- [ ] Test notification preferences
- [ ] Test different notification types

#### 📱 Integration Testing

- [ ] Test welcome notifications on signup
- [ ] Test cart reminders
- [ ] Test order updates
- [ ] Test promotional notifications
- [ ] Test notification navigation

## ✅ Phase 6 Completion Criteria

- [ ] Push notification permissions are working
- [ ] Token generation and storage is functional
- [ ] Welcome notifications are sent on signup
- [ ] Cart reminder notifications work
- [ ] Order update notifications work
- [ ] Promotional notifications work
- [ ] Notification preferences are saved
- [ ] Notification handling and navigation work
- [ ] Edge functions are deployed and working
- [ ] All notification types are tested

## 🚀 Next Steps

After completing Phase 6:

1. Begin Phase 7: Testing and optimization
2. Implement checkout flow
3. Add analytics and tracking

## 📝 Notes

- Test notifications on physical devices
- Ensure proper error handling for notification failures
- Implement notification rate limiting
- Test notification preferences thoroughly
- Verify notification navigation works correctly
- Monitor notification delivery rates
