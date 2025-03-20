import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "../Themed";

type BaseItem = {
  _id: string;
  name: string;
};

export function GroupCard<T extends BaseItem>({ item }: { item: T }) {
  return (
    <Link href={`/groups/${item._id}`} asChild>
      <Pressable style={styles.card}>
        <MaterialIcons name="folder-open" size={64} color="#B8BDC7" />
        <Text style={styles.text}>{item.name}</Text>
        <MaterialIcons name="chevron-right" size={32} color="#B8BDC7" />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E6F8FC",
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    width: "70%",
  },
  icon: {
    flex: 1,
  },
});
