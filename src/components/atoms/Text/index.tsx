import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";
import { Colors } from "../../../assets/colors";

interface CustomTextProps extends TextProps {
  bold?: boolean;
  danger?: boolean;
  success?: boolean;
}

const CustomText: React.FC<CustomTextProps> = ({
  bold,
  danger,
  success,
  ...rest
}) => {
  return (
    <Text
      {...rest}
      style={[
        styles.text,
        bold && styles.bold,
        danger && styles.danger,
        success && styles.success,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
    fontSize: 16,
  },
  bold: { fontWeight: "bold" },
  danger: { color: Colors.danger },
  success: { color: Colors.success },
});

export default CustomText;
