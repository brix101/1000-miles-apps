import { Text, View } from "@/components/Themed";
import { AvatarContainer } from "@/components/avatar-container";
import { Language } from "@/i18n/config";
import { useSession } from "@/providers/session-provider";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { session } = useSession();

  const langKey = i18n.language as Language;

  return (
    <View style={styles.main}>
      <AvatarContainer user={session} />
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("keyText_language")}</Text>
        </View>
        <Link href={`/profile/${session?._id}/language`} asChild>
          <Pressable style={styles.card}>
            <View style={styles.cardTextIcon}>
              <Feather name="globe" size={32} color="#16223B" />
              <Text style={styles.cardText}>{t(`languages.${langKey}`)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={32} color="#16223B" />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 10,
  },
  section: {
    margin: 10,
  },
  header: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    borderColor: "#B8BDC7",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  cardTextIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardText: {
    fontSize: 14,
  },
});
