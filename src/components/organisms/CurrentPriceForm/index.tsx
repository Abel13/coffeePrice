import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../../assets/colors";
import { Input, Text } from "../../atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { getCurrencyValue } from "../../../services/currency";

interface Props {
  referencePrice: number;
}

const CurrentPriceForm: React.FC<Props> = ({ referencePrice = 0 }) => {
  const [differenceColor, setDifferenceColor] = useState(Colors.white);

  const schema = Yup.object().shape({
    price: Yup.number().min(0, "Valor iválido").required("Campo obrigatório"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (price === 0) setDifferenceColor(Colors.white);
    else if (price <= referencePrice + referencePrice * 0.12001)
      setDifferenceColor(Colors.defaultPrice);
    else if (price <= referencePrice + referencePrice * 0.18001)
      setDifferenceColor(Colors.goodPrice);
    else setDifferenceColor(Colors.highPrice);
  }, [price, setDifferenceColor]);

  const differencePrice = useMemo(() => {
    if (price === 0) return 0;
    return price - referencePrice;
  }, [price]);

  const differencePercent = useMemo(() => {
    try {
      const result = ((differencePrice / referencePrice) * 100).toFixed(2);
      return result;
    } catch (error) {
      return 0;
    }
  }, [differencePrice]);

  const onSubmit = (data) => {
    setPrice(data.price);
  };

  return (
    <View style={[{ borderBottomColor: differenceColor }, styles.inputCard]}>
      <View style={{ padding: 8 }}>
        <Text bold>Cotação atual</Text>

        <View style={{ margin: 5 }} />
        <Input
          type="currency"
          control={control}
          name={"price"}
          error={errors.price?.message}
          placeholder="Preço oferecido"
          onEndEditing={handleSubmit(onSubmit)}
        />
      </View>
      <View style={styles.differenceContainer}>
        <View style={styles.reaisDifferenceContainer}>
          <Text bold>Diferença R$</Text>
          <Text>{getCurrencyValue(differencePrice)}</Text>
        </View>
        <View style={styles.percentDifferenceContainer}>
          <Text bold>Diferença %</Text>
          <Text>{`${differencePercent}%`}</Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentPriceForm;

const styles = StyleSheet.create({
  inputCard: {
    backgroundColor: Colors.secondary,
    borderBottomWidth: 5,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  differenceContainer: {
    borderTopColor: Colors.white,
    borderTopWidth: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  reaisDifferenceContainer: {
    borderRightColor: Colors.white,
    borderRightWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  percentDifferenceContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingVertical: 8,
  },
});
