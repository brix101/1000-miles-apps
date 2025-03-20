import { formatDistanceToNow, isToday } from "date-fns";
import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";

interface Props {
  dateString: string;
}

export default function RetakeHeaderCard({ dateString }: Props) {
  const date = new Date(dateString);

  let formattedDate = formatDistanceToNow(date, { addSuffix: true });
  if (isToday(date)) {
    formattedDate = "Today";
  }

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{formattedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 40,
    paddingBottom: 15,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
