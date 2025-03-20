import { Pressable, PressableProps, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

interface RadioButtonProps extends PressableProps {
  isSelected?: boolean;
  title?: string;
}

export function RadioButton({ title, isSelected, ...props }: RadioButtonProps) {
  return (
    <Pressable {...props} style={stytes.wrapper}>
      <View style={stytes.circle1}>
        {isSelected ? <View style={stytes.circle2} /> : undefined}
      </View>
      <Text style={stytes.text}>{title}</Text>
    </Pressable>
  );
}

const stytes = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 10,
  },
  circle1: {
    borderColor: "#16223B",
    borderRadius: 50,
    borderWidth: 1,
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  circle2: {
    backgroundColor: "#16223B",
    borderRadius: 50,
    height: 16,
    width: 16,
  },
  text: {
    fontSize: 16,
  },
});
