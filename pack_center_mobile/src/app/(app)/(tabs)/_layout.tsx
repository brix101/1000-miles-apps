import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

import { View } from "@/components/Themed";
import { ProfileMenu } from "@/components/profile-menu";
import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useOnlineStatus } from "@/providers/query-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isOnline = useOnlineStatus();

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("keyTitle_salesOrders"),
            headerTitle: t("keyHeader_groups"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="view-grid-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="assortments"
          options={{
            title: t("keyTitle_assortments"),
            headerTitle: t("keyHeader_items"),
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="package-variant" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="retakes"
          options={{
            title: t("keyTitle_retakes"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="camera-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("keyTitle_profile"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="account-cog-outline" color={color} />
            ),
            headerRight: () => (
              <View style={{ marginRight: 15 }}>
                {isOnline && <ProfileMenu />}
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
