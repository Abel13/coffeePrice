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

import { Colors } from "./src/assets/colors";
import { getBrDate, getTime } from "./src/services/date";
import { Item, CurrentPriceForm } from "./src/components/organisms";

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
    if (dataLoaded === false) fetchData();
  }, [dataLoaded]);

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
            <Text>{`${getBrDate(currentDate)} - ${getTime(
              currentDate
            )}h`}</Text>
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

          <CurrentPriceForm
            referencePrice={currentDollarPrice * currentArabicaPrice}
          />

          <View style={{ margin: 10 }} />
          <View>
            <FlatList
              data={data}
              horizontal
              keyExtractor={(item) => item.date.toString()}
              renderItem={({ item }) => <Item item={item} />}
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
});
