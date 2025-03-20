import { Text, View } from "@/components/Themed";
import { RadioButton } from "@/components/radio-button";
import { Language, supportedLang } from "@/i18n/config";
import { useSession } from "@/providers/session-provider";
import { useUpdateUserLanguage } from "@/services/translations/updateUserLanguage";
import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

export default function LanguageScreen() {
  const { t } = useTranslation();
  const { session } = useSession();
  const { mutate } = useUpdateUserLanguage();
  const navigation = useNavigation();
  const [activeLang, setActiveLang] = React.useState<Language>(
    (session?.language as Language) ?? "en"
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("keyTitle_profile"),
      headerRight: () => (
        <Pressable
          style={styles.saveBtn}
          onPress={() => {
            if (session) {
              mutate({ _id: session._id, language: activeLang });
            }
          }}
        >
          <Text style={styles.saveBtnText}>{t("keyButton_save")}</Text>
        </Pressable>
      ),
    });
  }, [navigation, activeLang, t]);

  return (
    <View style={styles.main}>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("keyText_language")}</Text>
        </View>
      </View>
      <View>
        {supportedLang.map((lang, index) => (
          <View key={index} style={styles.card}>
            <RadioButton
              key={index}
              title={t(`languages.${lang}`)}
              isSelected={lang === activeLang}
              onPress={() => setActiveLang(lang)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 10,
  },
  section: {},
  header: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  card: { padding: 10 },
  saveBtn: {
    backgroundColor: "#16223B",
    padding: 5,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
