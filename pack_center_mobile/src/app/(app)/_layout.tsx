import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useOnlineStatus } from "@/providers/query-provider";
import { useSession } from "@/providers/session-provider";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function AppLayout() {
  const isOnline = useOnlineStatus();
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar backgroundColor={isOnline ? "#01AED6" : "#FF0053"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="assortments" options={{ headerShown: false }} />
        <Stack.Screen name="groups" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="salesOrder" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
