import { i18next } from "@/i18n/config";
import { CameraProvider } from "@/providers/camera-state";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Appearance } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  //HACK Remove this to use dark mode colors
  useEffect(() => {
    Appearance.setColorScheme("light");
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <MenuProvider>
        <I18nextProvider i18n={i18next}>
          <QueryProvider>
            <SessionProvider>
              <CameraProvider>
                <Slot />
              </CameraProvider>
            </SessionProvider>
          </QueryProvider>
        </I18nextProvider>
      </MenuProvider>
    </ActionSheetProvider>
  );
}
