import { format, parseISO } from "date-fns";
import { ActivityIndicator, RefreshControl, StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import NoDataCard from "@/components/cards/no-data-card";
import { RetakeCard } from "@/components/cards/retake-card";
import RetakeHeaderCard from "@/components/cards/retake-header-card";
import { useGetInfiniteRetakes } from "@/services/retakes/getInfiniteRetakes";
import { FlashList } from "@shopify/flash-list";

export default function RetakesScreen() {
  const { data, isLoading, isRefetching, refetch, fetchNextPage } =
    useGetInfiniteRetakes();

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const totalItems = data?.pages[0].totalItems || 140;

  const groupedItems = items.reduce((groups, item) => {
    const date = format(parseISO(item.createdAt), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, (typeof items)[0][]>);

  const sortedDates = Object.keys(groupedItems).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const sectionedItems = sortedDates.reduce((arr, date) => {
    arr.push(date);
    arr.push(...groupedItems[date]);
    return arr;
  }, [] as (string | (typeof items)[0])[]);

  return (
    <View style={styles.container}>
      <FlashList
        data={sectionedItems}
        keyExtractor={(x) => {
          return typeof x === "string" ? x : x._id;
        }}
        estimatedItemSize={totalItems}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchNextPage()}
        renderItem={({ item }) => {
          if (typeof item === "string") {
            return <RetakeHeaderCard dateString={item} />;
          } else {
            return <RetakeCard item={item} />;
          }
        }}
        ListEmptyComponent={() => {
          return isLoading ? <ActivityIndicator /> : <NoDataCard />;
        }}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === "string" ? "sectionHeader" : "row";
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
    flexDirection: "column",
  },
});
