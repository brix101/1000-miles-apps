import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import { InputTextProps, TextInput } from "@/components/ui/text-input";

export const PasswordInput: React.FC<InputTextProps> = (props) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        secureTextEntry={!isPasswordVisible}
        {...props}
      />
      <MaterialCommunityIcons
        name={isPasswordVisible ? "eye-off" : "eye"}
        size={24}
        color="#aaa"
        style={styles.icon}
        onPress={togglePasswordVisibility}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#B8BDC7",
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 0,
  },
  icon: {
    marginLeft: 10,
  },
});
