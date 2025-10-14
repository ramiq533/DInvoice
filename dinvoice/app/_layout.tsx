import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 hides the default header on all screens
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="pages" />
    </Stack>
  );
}
