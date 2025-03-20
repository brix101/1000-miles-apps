import { TextInput as DefaultTextInput, StyleSheet } from "react-native";

export type InputTextProps = DefaultTextInput["props"];

export function TextInput(props: InputTextProps) {
  const { style, ...otherProps } = props;

  return <DefaultTextInput style={[styles.input, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: "#B8BDC7",
    borderRadius: 8,
    color: "#31374a",
    width: "100%",
    textAlign: "left",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
  },
});
