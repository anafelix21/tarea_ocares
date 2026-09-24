import React from 'react';
import { Stack } from 'expo-router';
import { AuthStoreProvider } from '../store/auth.store';
import colors from '../constants/colors';

export default function RootLayout() {
  return (
    <AuthStoreProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthStoreProvider>
  );
}
