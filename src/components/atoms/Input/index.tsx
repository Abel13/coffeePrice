import { useCallback, useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

export interface InputProps extends TextInputProps {
  name: string;
  control: Control;
  error: any;
  type?: "currency" | "button";
  onPress?: () => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#c9c9c9",
    borderRadius: 8,
    borderColor: "#8a7d7d",
    borderWidth: 2,
    height: 50,
    width: "100%",
    alignItems: "center",
  },
  prefix: {
    color: "#685d56",
    marginRight: 8,
    padding: 8,
  },
  containerSelected: { borderBottomColor: "#926452" },
  prefixSelected: { color: "#926452", marginRight: 8 },
  input: {
    flex: 1,
    color: "#685d56",
  },
  error: {
    width: "100%",
    paddingLeft: 16,
    paddingTop: 4,
    color: "#DF7474",
  },
});

const Input: React.FC<InputProps> = ({
  error,
  name,
  control,
  type,
  placeholder,
  onPress,
  ...rest
}) => {
  const [selected, setSelected] = useState(false);
  const format = (value: number) => value * 0.01;
  const stringToNumber = (value: string): number => {
    const newValue = parseInt(value.replace(/\./g, ""), 10);
    return newValue >= 0 ? newValue : 0;
  };

  const handleChange = useCallback((text: string) => {
    if (type === "currency") {
      const value = stringToNumber(text);
      const valueFormatted = value === 0 ? "0.00" : format(value).toFixed(2);

      return valueFormatted;
    } else if (type === "button") {
    } else {
      return text;
    }
  }, []);

  const renderInput = (value: string, onChange: (...event: any[]) => void) => {
    switch (type) {
      case "currency":
        return (
          <View
            style={[styles.container, selected && styles.containerSelected]}
          >
            <Text style={[styles.prefix, selected && styles.prefixSelected]}>
              R$
            </Text>
            <TextInput
              {...rest}
              keyboardType="decimal-pad"
              maxLength={18}
              style={styles.input}
              onChangeText={(text) => onChange(handleChange(text))}
              placeholderTextColor={"#685d56"}
              placeholder={placeholder}
              selectionColor={"#926452"}
              value={value}
              onFocus={() => setSelected(true)}
              onBlur={() => setSelected(false)}
            />
          </View>
        );
      default:
        return (
          <View
            style={[styles.container, selected && styles.containerSelected]}
          >
            <TextInput
              {...rest}
              onChangeText={(text) => onChange(handleChange(text))}
              value={value}
              placeholder={placeholder}
              style={styles.input}
              placeholderTextColor={"#886f5e"}
              onFocus={() => setSelected(true)}
              onBlur={() => setSelected(false)}
            />
          </View>
        );
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <>
          {renderInput(value, onChange)}

          {error && <Text style={styles.error}>{error}</Text>}
        </>
      )}
    />
  );
};

export default Input;
