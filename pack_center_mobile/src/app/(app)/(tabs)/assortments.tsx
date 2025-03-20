import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  TextInputSubmitEditingEventData,
} from "react-native";

import { View } from "@/components/Themed";
import { AssortmentCard } from "@/components/cards/assortment-card";
import NoDataCard from "@/components/cards/no-data-card";
import { useGetInfiniteAssortment } from "@/services/assortments/getInfiniteAssortments";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator();

export default function AssortmentStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={t("keyHeader_items")}
        component={AssortmentsScreen}
        options={{}}
      />
    </Stack.Navigator>
  );
}

export function AssortmentsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [search, setSearch] = React.useState("");
  const { data, fetchNextPage, isLoading, isRefetching, refetch } =
    useGetInfiniteAssortment({ keyword: search });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const totalItems = data?.pages[0].totalItems || 140;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("keyHeader_items"),
      headerSearchBarOptions: {
        placeHolder: t("keyPlaceholder_search"),
        onChangeText: (
          event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
        ) => {
          if (!event.nativeEvent.text.length) {
            setSearch("");
          }
        },
        onSearchButtonPress: (
          e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
        ) => {
          setSearch(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlashList
        data={items}
        numColumns={2}
        keyExtractor={(x) => x._id}
        estimatedItemSize={totalItems}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchNextPage()}
        renderItem={({ item }) => <AssortmentCard item={item} />}
        ListEmptyComponent={() => {
          return isLoading ? <ActivityIndicator /> : <NoDataCard />;
        }}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
  },
});
