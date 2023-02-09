import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  bold?: boolean;
  danger?: boolean;
}

const CustomText: React.FC<CustomTextProps> = ({ bold, danger, ...rest }) => {
  return (
    <Text
      {...rest}
      style={[styles.text, bold && styles.bold, danger && styles.danger]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  bold: { fontWeight: "bold" },
  danger: { color: "#DF7474" },
});

export default CustomText;
