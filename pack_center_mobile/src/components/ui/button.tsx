import React from "react";
import {
  ActivityIndicator,
  Pressable as DefaultPressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export type PressableProps = React.ComponentProps<typeof DefaultPressable> & {
  title?: string;
  isLoading?: boolean;
};

export function Button({
  style,
  title,
  isLoading,
  ...otherProps
}: PressableProps) {
  return (
    <DefaultPressable
      style={[
        styles.button,
        style as ViewStyle,
        { backgroundColor: otherProps.disabled ? "#B8BDC7" : "#16223B" },
      ]}
      disabled={isLoading}
      {...otherProps}
    >
      <View>
        {isLoading ? (
          <ActivityIndicator color={"#fff"} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </View>
    </DefaultPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
