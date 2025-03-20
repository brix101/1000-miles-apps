import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";

const NoDataCard = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("keyInfo_noDataAvailable")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});

export default NoDataCard;
