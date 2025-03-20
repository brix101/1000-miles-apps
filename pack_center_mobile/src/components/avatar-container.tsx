import { UserResource } from "@/schema/user";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";

export function AvatarContainer({ user }: { user?: UserResource | null }) {
  const icon = user?.name?.charAt(0) ?? "";
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{icon}</Text>
      </View>
      <View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: "#B8BDC7",
    backgroundColor: "#e5edff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#007bff",
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  email: {
    fontSize: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
