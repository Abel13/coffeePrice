import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
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
  const [differenceColor, setDifferenceColor] = useState("#fff");
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

    if (price === 0) setDifferenceColor("#fff");
    else if (price <= referencePrice + referencePrice * 0.12001)
      setDifferenceColor("#a15158");
    else if (price <= referencePrice + referencePrice * 0.18001)
      setDifferenceColor("#5171A8");
    else setDifferenceColor("#518158");
  }, [price, setDifferenceColor]);

  const itemRender = ({ item }) => {
    const mainPrice = item.dollarPrice * item.arabicaPrice;
    const oldPrice = item.oldPrice;
    const delta = mainPrice - oldPrice;

    return (
      <View
        style={{
          borderRadius: 8,
          width: 300,
          margin: 5,
          backgroundColor: "#1F232C",
        }}
      >
        <View
          style={{
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            flexDirection: "row",
            marginBottom: 5,
            padding: 16,
            backgroundColor: "#51515888",
          }}
        >
          <Text>Data: </Text>
          <Text>{dayjs(item.date).format("DD/MM/YYYY HH:mm")}</Text>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#51515888",
            paddingVertical: 5,
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
              borderRightWidth: 1,
              borderRightColor: "#51515888",
            }}
          >
            <Text bold>Café Arábica KC</Text>
            <Text>{getCurrencyValue(item.arabicaPrice, "USD")}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text bold>Dolar</Text>
            <Text>{getCurrencyValue(item.dollarPrice)}</Text>
          </View>
        </View>

        <View
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#51515888",
          }}
        >
          <View style={{ margin: 5 }} />
          <Text>Preço do café R$</Text>
          <Text>{getCurrencyValue(mainPrice)}</Text>
          <View style={{ marginTop: 5 }}>
            <Text>Variação de preço</Text>
            <Text danger={delta < 0}>{getCurrencyValue(delta)}</Text>
          </View>
        </View>

        <View>
          <View
            style={{
              backgroundColor: "#51515888",
              paddingHorizontal: 16,
              padding: 2,
            }}
          >
            <Text bold>Diferencial (Bebida Dura)</Text>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              padding: 5,
              backgroundColor: "#51815888",
            }}
          >
            <Text bold>Muito Alto 18% a 25%</Text>
            <Text>{`${getCurrencyValue(
              mainPrice * 0.18001 + mainPrice
            )} a ${getCurrencyValue(mainPrice * 0.25 + mainPrice)}`}</Text>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              padding: 5,
              backgroundColor: "#5171A888",
            }}
          >
            <Text bold>Alto 12% a 18%</Text>
            <Text>{`${getCurrencyValue(
              mainPrice * 0.12001 + mainPrice
            )} a ${getCurrencyValue(mainPrice * 0.18 + mainPrice)}`}</Text>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              padding: 5,
              backgroundColor: "#a1515888",
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          >
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
          <View style={{ alignItems: "center" }}>
            <Text bold>CONTROLE DE PREÇOS</Text>
          </View>
          <View style={{ margin: 10 }} />
          <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
            <Text bold>Data: </Text>
            <Text>{dayjs(currentDate).format("DD/MM/YYYY")}</Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
            <Text bold>Dolar: </Text>
            <Text>{getCurrencyValue(currentDollarPrice)}</Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
            <Text bold>Café Arábica KC: </Text>
            <Text>{getCurrencyValue(currentArabicaPrice, "USD")}</Text>
          </View>
          <View style={{ margin: 5 }} />

          <View
            style={{
              backgroundColor: "#514171",
              borderBottomColor: differenceColor,
              borderBottomWidth: 5,
              borderRadius: 8,
              marginHorizontal: 16,
            }}
          >
            <View style={{ padding: 8 }}>
              <Text bold>Cotação atual</Text>

              <Input
                type="currency"
                control={control}
                name={"price"}
                error={errors.price?.message}
                placeholder="Preço oferecido"
                onEndEditing={handleSubmit(onSubmit)}
              />
            </View>
            <View
              style={{
                borderTopColor: "#FFF",
                borderTopWidth: 1,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
              }}
            >
              <View
                style={{
                  borderRightColor: "#FFF",
                  borderRightWidth: 1,
                  flex: 1,
                  paddingVertical: 8,
                }}
              >
                <Text bold>Diferença R$</Text>
                <Text>{getCurrencyValue(differencePrice)}</Text>
              </View>
              <View
                style={{ flex: 1, alignItems: "flex-end", paddingVertical: 8 }}
              >
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
              keyExtractor={(item: IPrice) => item.date}
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
    backgroundColor: "#83746E",
    flex: 1,
  },
});
