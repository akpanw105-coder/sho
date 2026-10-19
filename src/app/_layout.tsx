import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ShoColors } from '@/constants/sho-theme';
import { ShoProvider } from '@/context/sho-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ShoProvider>
        <StatusBar barStyle="light-content" backgroundColor={ShoColors.surface} />
        <View style={styles.container}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: ShoColors.surface },
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="explore" />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="search" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="wishlist" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="order-confirmation" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="order-tracking" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="auth/sign-in" />
            <Stack.Screen name="auth/sign-up" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="admin/index" />
            <Stack.Screen name="admin/products" />
            <Stack.Screen name="admin/orders" />
            <Stack.Screen name="admin/customers" />
            <Stack.Screen name="admin/inventory" />
          </Stack>
        </View>
      </ShoProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShoColors.surface,
  },
});
