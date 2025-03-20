import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import { AssortmentImages } from "@/components/forms/assortment-image";
import { useGetAssortment } from "@/services/assortments/getAssortment";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";

export default function AssortmentScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const assortId = (id as string) || "";

  const {
    data: assort,
    refetch,
    isRefetching,
  } = useGetAssortment(assortId, {
    enabled: assortId !== "",
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: assort
        ? `${assort.customerItemNo} - ${assort.itemNo}`
        : "Item",
    });
  }, [navigation, assort]);

  return (
    <View style={styles.main}>
      {assort && (
        <AssortmentImages
          assortment={assort}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
