import { View } from "@/components/Themed";
import { ActivityIndicator, RefreshControl, StyleSheet } from "react-native";

import { GroupCard } from "@/components/cards/group-card";
import NoDataCard from "@/components/cards/no-data-card";
import { useGetGroups } from "@/services/groups/getGroups";
import { FlashList } from "@shopify/flash-list";

export default function GroupsScreen() {
  const { data, isLoading, isRefetching, refetch } = useGetGroups();
  const estimatedItemSize = data?.length || 140;

  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        estimatedItemSize={estimatedItemSize}
        keyExtractor={(x) => x._id}
        renderItem={({ item }) => <GroupCard item={item} />}
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
});
