import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Input, Text } from "./src/components/atoms";
import { getCurrencyValue } from "./src/services/currency";
import { useMainStore, IPrice } from "./src/store/main";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Colors } from "./src/assets/colors";
import { getBrDate, getTime } from "./src/services/date";

export default function App() {
  const {
    state: {
      currentArabicaPrice,
      currentDollarPrice,
      currentDate,
      data,
      dataLoaded,
    },
    getData,
    resetCurrentData,
  } = useMainStore((store) => store);

  const [loading, setLoading] = useState(false);
  const [differenceColor, setDifferenceColor] = useState(Colors.white);
  const [price, setPrice] = useState(0);
  const differencePrice = useMemo(() => {
    if (price === 0) return 0;
    const referencePrice = currentDollarPrice * currentArabicaPrice;
    return price - referencePrice;
  }, [price, currentDollarPrice, currentArabicaPrice]);

  const differencePercent = useMemo(() => {
    const referencePrice = currentDollarPrice * currentArabicaPrice;
    return ((differencePrice / referencePrice) * 100).toFixed(2);
  }, [differencePrice, currentArabicaPrice, currentDollarPrice]);

  const schema = Yup.object().shape({
    price: Yup.number().min(0, "Valor iválido").required("Campo obrigatório"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const fetchData = async () => {
    setLoading(true);
    try {
      await getData();
    } catch (error) {
      console.log("🚀 ~ file: App.tsx:55 ~ fetchData ~ error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetCurrentData();
  }, []);

  useEffect(() => {
    if (!dataLoaded) fetchData();
  }, [dataLoaded]);

  useEffect(() => {
    const referencePrice = currentDollarPrice * currentArabicaPrice;

    if (price === 0) setDifferenceColor(Colors.white);
    else if (price <= referencePrice + referencePrice * 0.12001)
      setDifferenceColor(Colors.defaultPrice);
    else if (price <= referencePrice + referencePrice * 0.18001)
      setDifferenceColor(Colors.goodPrice);
    else setDifferenceColor(Colors.highPrice);
  }, [price, setDifferenceColor]);

  const itemRender = ({ item }) => {
    const mainPrice = item.dollarPrice * item.arabicaPrice;
    const oldPrice = item.oldPrice;
    const delta = mainPrice - oldPrice;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text bold>Data: </Text>
          <Text>{`${getBrDate(item.date)} - ${getTime(item.date)}`}</Text>
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

  const onSubmit = (data) => {
    setPrice(data.price);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={getData} />
          }
        >
          <View style={styles.titleContainer}>
            <Text bold>CONTROLE DE PREÇOS</Text>
          </View>
          <View style={[styles.row, styles.currentDateContainer]}>
            <Text bold>Data: </Text>
            <Text>{getBrDate(currentDate)}</Text>
          </View>
          <View style={[styles.row, styles.currentPriceContainer]}>
            <View style={styles.currentArabicaContent}>
              <Text bold>Café Arábica KC: </Text>
              <Text>{getCurrencyValue(currentArabicaPrice, "USD")}</Text>
            </View>
            <View style={styles.currentDollarContent}>
              <Text bold>Dolar: </Text>
              <Text>{getCurrencyValue(currentDollarPrice)}</Text>
            </View>
          </View>

          <View
            style={[{ borderBottomColor: differenceColor }, styles.inputCard]}
          >
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

          <View style={{ margin: 10 }} />
          <View>
            <FlatList
              data={data}
              horizontal
              keyExtractor={(item) => item.date.toString()}
              renderItem={itemRender}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  titleContainer: { alignItems: "center", marginBottom: 10 },
  row: { flexDirection: "row" },
  currentDateContainer: {
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
    marginHorizontal: 16,
  },
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
  currentPriceContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 16,
  },
  currentArabicaContent: {
    paddingHorizontal: 16,
    flex: 1,
    padding: 4,
    borderRightColor: Colors.border,
    borderRightWidth: 1,
  },
  currentDollarContent: {
    paddingHorizontal: 16,
    flex: 1,
    padding: 4,
  },
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
