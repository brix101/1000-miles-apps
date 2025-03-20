import { View } from "@/components/Themed";
import { AssortmentCard } from "@/components/cards/assortment-card";
import NoDataCard from "@/components/cards/no-data-card";
import { useGetInfiniteAssortment } from "@/services/assortments/getInfiniteAssortments";
import { useGetSalesOrder } from "@/services/salesOrder/getSalesOrder";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  TextInputSubmitEditingEventData,
} from "react-native";

export default function SalesOrderScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const soId = (id as string) ?? ("" as string);

  const { data: salesOrder } = useGetSalesOrder(soId, {
    enabled: soId !== "",
  });

  const [search, setSearch] = React.useState("");

  const {
    data: assortments,
    fetchNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useGetInfiniteAssortment({
    keyword: search,
    orderId: salesOrder?.orderId,
  });

  const items = assortments?.pages.flatMap((page) => page.items) ?? [];
  const totalItems = assortments?.pages[0].totalItems || 140;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: salesOrder?.name ?? "Items",
      headerSearchBarOptions: {
        placeHolder: "Search...",
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
  }, [navigation, salesOrder]);

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#01AED6",
  },
  heading: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
