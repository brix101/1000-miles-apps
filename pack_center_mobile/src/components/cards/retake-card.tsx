import { useSession } from "@/providers/session-provider";
import { Retake } from "@/types/retakes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";

export function RetakeCard({ item }: { item: Retake }) {
  const { session } = useSession();
  const { t } = useTranslation();
  const createdBy = item.createdBy;
  const iconText = createdBy.name.charAt(0).toUpperCase();
  const itemNo = item.item.customerItemNo;
  const timeInfo = format(new Date(item.createdAt), "hh:mm a");
  const dateInfo = format(new Date(item.createdAt), "MMMM d, yyyy");

  let name = createdBy.name;
  if (session?._id === createdBy._id) {
    name = t("keyText_you");
  }

  return (
    <Link href={`/assortments/${item.item._id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.mainSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iconText}</Text>
          </View>
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.messageContainer}>
              <Text>
                <Text style={styles.message}>
                  {t("keyMessage_wantToRetake")}
                </Text>
                <Text style={styles.messageInfo}> "{itemNo}"</Text>
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons name="clock" size={20} color="#525B75" />
              <Text style={styles.timeInfo}>{timeInfo}</Text>
              <Text style={styles.dateInfo}>{dateInfo}</Text>
            </View>
          </View>
        </View>
        {item.isDone ? (
          <View style={styles.buttonDone}>
            <Text style={styles.buttonText}>{t("keyStatus_done")}</Text>
          </View>
        ) : (
          <View style={styles.buttonNotDone}>
            <Text style={styles.buttonText}>{t("keyStatus_notdone")}</Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#B8BDC7",
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxHeight: 150,
  },
  avatar: {
    width: 34,
    height: 34,
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
  infoContainer: {
    gap: 5,
  },
  name: { fontSize: 14, fontWeight: "bold" },
  mainSection: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: "row",
  },
  message: {
    fontSize: 12,
  },
  messageInfo: {
    fontSize: 12,
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeInfo: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#525B75",
  },
  dateInfo: {
    fontSize: 12,
    color: "#525B75",
  },
  buttonDone: {
    height: "100%",
    backgroundColor: "#16223B",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: 50,
  },
  buttonNotDone: {
    height: "100%",
    backgroundColor: "#FF0053",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
