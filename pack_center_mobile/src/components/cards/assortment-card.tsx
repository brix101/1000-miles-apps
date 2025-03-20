import { QUERY_KEYS } from "@/constants/query.key";
import { BASE_URL } from "@/lib/axios-client";
import { log } from "@/lib/logger";
import { Assortment } from "@/types/assortment";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutationState } from "@tanstack/react-query";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  item: Assortment;
};

export function AssortmentCard({ item }: Props) {
  const data = useMutationState({
    filters: { mutationKey: [QUERY_KEYS.ASSORTMENTS, item._id] },
    select: (state) => state.state,
  });

  const mutation = data[0];

  return (
    <Link href={`/assortments/${item._id}`} asChild>
      <Pressable style={styles.card}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${BASE_URL}/files/static/${item.image?.filename}`,
          }}
          onError={(e) => {
            log.error(e.nativeEvent.error);
          }}
        />
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.customerItemNo}>{item.customerItemNo}</Text>
            <Text style={styles.itemNo}>{item.itemNo}</Text>
          </View>
          <View style={styles.statusContainer}>
            {mutation && (
              <>
                {mutation.status === "success" && (
                  <FontAwesome5 name="check-circle" size={16} color="#25B003" />
                )}
                {mutation.status === "pending" && (
                  <ActivityIndicator size={16} color="#01AED6" />
                )}
              </>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "#B8BDC7",
    fontSize: 20,
    fontWeight: "bold",
    width: 160,
    height: 130,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
  },
  cardFooter: {
    flex: 1,
    borderTopWidth: 0.5,
    borderColor: "#B8BDC7",
    paddingVertical: 2,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
    position: "relative",
  },
  customerItemNo: {
    fontSize: 10,
    fontWeight: "bold",
  },
  itemNo: {
    fontSize: 10,
    color: "#848B98",
  },
  statusContainer: {
    position: "absolute",
    right: 5,
  },
});
