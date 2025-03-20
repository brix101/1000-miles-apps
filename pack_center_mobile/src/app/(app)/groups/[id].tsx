import {
  ActivityIndicator,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  TextInputSubmitEditingEventData,
} from "react-native";

import { Text, View } from "@/components/Themed";
import NoDataCard from "@/components/cards/no-data-card";
import { SalesOrderCard } from "@/components/cards/sales-order-card";
import { useGetGroup } from "@/services/groups/getgroup";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function GroupScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const groupId = (id as string) ?? ("" as string);
  const { data, isLoading, isRefetching, refetch } = useGetGroup(groupId, {
    enabled: groupId !== "",
  });

  const allItems = data?.salesOrders ?? [];
  const itemCount = allItems.length || 140;

  const [search, setSearch] = React.useState("");

  const items = allItems.filter(
    (item) =>
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.customerPoNo.toLowerCase().includes(search.toLowerCase())
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("keyHeader_groups"),
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
      <View style={styles.header}>
        <Text style={styles.heading}>Sales Order</Text>
        <Text style={styles.heading}>Customer PO</Text>
      </View>
      <FlashList
        data={items}
        estimatedItemSize={itemCount}
        keyExtractor={(x) => x._id}
        renderItem={({ item }) => <SalesOrderCard item={item} />}
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
