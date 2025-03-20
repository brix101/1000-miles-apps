import { SalesOrder } from "@/types/salesOrder";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";

type SalesOrderCardProps = {
  item: SalesOrder;
};

export function SalesOrderCard({ item }: SalesOrderCardProps) {
  return (
    <Link href={`/salesOrder/${item._id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.customerPoNo}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E6F8FC",
    borderRadius: 8,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 12,
  },
});
