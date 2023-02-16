import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../../assets/colors";
import { getCurrencyValue } from "../../../services/currency";
import { getBrDate, getTime } from "../../../services/date";
import { IPrice } from "../../../store/main";
import { Text } from "../../atoms";

interface Props {
  item: IPrice;
}

const Item: React.FC<Props> = ({ item }) => {
  const mainPrice = item.dollarPrice * item.arabicaPrice;
  const oldPrice = item.oldPrice;
  const delta = mainPrice - oldPrice;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text bold>Data: </Text>
        <Text>{`${getBrDate(item.date)} - ${getTime(item.date)}h`}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.coffeeContainer}>
          <Text bold>Café Arábica KC</Text>
          <Text>{getCurrencyValue(item.arabicaPrice, "USD")}</Text>
        </View>
        <View style={styles.dollarContainer}>
          <Text bold>Dolar</Text>
          <Text>{getCurrencyValue(item.dollarPrice)}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={{ margin: 5 }} />
        <Text>Preço do café R$</Text>
        <Text>{getCurrencyValue(mainPrice)}</Text>
        <View style={{ marginTop: 5 }}>
          <Text>Variação de preço</Text>
          <Text danger={delta < 0} success={delta > 0}>
            {getCurrencyValue(delta)}
          </Text>
        </View>
      </View>

      <View>
        <View style={styles.benefit}>
          <Text bold>Diferencial (Bebida Dura)</Text>
        </View>

        <View style={styles.highPrice}>
          <Text bold>Muito Alto 18% a 25%</Text>
          <Text>{`${getCurrencyValue(
            mainPrice * 0.18001 + mainPrice
          )} a ${getCurrencyValue(mainPrice * 0.25 + mainPrice)}`}</Text>
        </View>

        <View style={styles.goodPrice}>
          <Text bold>Alto 12% a 18%</Text>
          <Text>{`${getCurrencyValue(
            mainPrice * 0.12001 + mainPrice
          )} a ${getCurrencyValue(mainPrice * 0.18 + mainPrice)}`}</Text>
        </View>

        <View style={styles.defaultPrice}>
          <Text bold>Padrão 5% a 12%</Text>
          <Text>{`${getCurrencyValue(
            mainPrice * 0.05 + mainPrice
          )} a ${getCurrencyValue(mainPrice * 0.12 + mainPrice)}`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    width: 300,
    margin: 5,
    backgroundColor: Colors.card,
  },
  cardHeader: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginBottom: 5,
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray,
  },
  cardContent: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: 5,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coffeeContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.gray,
  },
  dollarContainer: { flex: 1, marginLeft: 16 },
  contentContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  benefit: {
    backgroundColor: Colors.gray,
    paddingHorizontal: 16,
    padding: 2,
  },
  highPrice: {
    paddingHorizontal: 16,
    padding: 5,
    backgroundColor: Colors.highPrice,
  },
  goodPrice: {
    paddingHorizontal: 16,
    padding: 5,
    backgroundColor: Colors.goodPrice,
  },
  defaultPrice: {
    paddingHorizontal: 16,
    padding: 5,
    backgroundColor: Colors.defaultPrice,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
});

export default Item;
