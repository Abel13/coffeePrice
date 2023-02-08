import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function App() {
  const [data, setData] = useState([
    {
      date: "2021-01-01",
      dolar: 5.21,
      arabica: 177.1,
      mainPrice: 5.21 * 177.1,
    },
    {
      date: "2021-01-02",
      dolar: 5.14,
      arabica: 178.1,
      mainPrice: 5.14 * 178.1,
    },
  ]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ padding: 16 }}>
        <Text>Controle de preço de referencia café arábica</Text>
        <View style={{ margin: 20 }} />

        <ScrollView horizontal>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                padding: 16,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 8,
                width: 300,
                margin: 5,
              }}
            >
              <Text>Data</Text>
              <TextInput value={data[1].date} />
              <Text>Café Arábica KC</Text>
              <TextInput value={data[1].dolar.toFixed(2)} />
              <Text>Cot Dolar</Text>
              <TextInput value={data[1].arabica.toFixed(2)} />
              <View style={{ margin: 5 }} />
              <Text>Preço de referência principal</Text>
              <Text>{`R$ ${data[1].mainPrice.toFixed(2)}`}</Text>
              <Text>Variação de preço</Text>
              <Text style={{ color: "red" }}>{`R$ ${(
                data[1].mainPrice - data[0].mainPrice
              ).toFixed(2)}`}</Text>

              <View style={{ margin: 5 }} />
              <Text>Diferencial</Text>
              <View style={{ marginBottom: 5 }}>
                <Text style={{ backgroundColor: "green" }}>
                  Muito Alto 20% a 25%
                </Text>
                <Text>{`R$ ${(
                  data[1].mainPrice * 0.181 +
                  data[1].mainPrice
                ).toFixed(2)} a R$ ${(
                  data[1].mainPrice * 0.25 +
                  data[1].mainPrice
                ).toFixed(2)}`}</Text>
              </View>

              <View style={{ marginVertical: 5 }}>
                <Text style={{ backgroundColor: "yellow" }}>
                  Alto 12% a 18%
                </Text>
                <Text>{`de R$ ${(
                  data[1].mainPrice * 0.121 +
                  data[1].mainPrice
                ).toFixed(2)} a R$ ${(
                  data[1].mainPrice * 0.18 +
                  data[1].mainPrice
                ).toFixed(2)}`}</Text>
              </View>

              <View style={{ marginVertical: 5 }}>
                <Text style={{ backgroundColor: "red" }}>Padrão 5% a 11%</Text>
                <Text>{`de R$ ${(
                  data[1].mainPrice * 0.05 +
                  data[1].mainPrice
                ).toFixed(2)} a R$ ${(
                  data[1].mainPrice * 0.12 +
                  data[1].mainPrice
                ).toFixed(2)}`}</Text>
              </View>
            </View>
            <View
              style={{
                padding: 16,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 8,
                width: 300,
                margin: 5,
              }}
            >
              <Text>Data</Text>
              <TextInput value={data[0].date} />
              <Text>Café Arábica KC</Text>
              <TextInput value={data[0].dolar.toFixed(2)} />
              <Text>Cot Dolar</Text>
              <TextInput value={data[0].arabica.toFixed(2)} />
              <View style={{ margin: 5 }} />
              <Text>Preço de referência principal</Text>
              <Text>{`R$ ${data[0].mainPrice.toFixed(2)}`}</Text>
              <Text>Variação de preço</Text>
              <Text style={{ color: "red" }}>{`R$ ${(
                data[0].mainPrice - data[0].mainPrice
              ).toFixed(2)}`}</Text>

              <View style={{ margin: 5 }} />
              <Text>Diferencial</Text>
              <View style={{ marginBottom: 5 }}>
                <Text style={{ backgroundColor: "green" }}>
                  Muito Alto 20% a 25%
                </Text>
                <Text>{`R$ ${(
                  data[0].mainPrice * 0.181 +
                  data[0].mainPrice
                ).toFixed(2)} a R$ ${(
                  data[0].mainPrice * 0.25 +
                  data[0].mainPrice
                ).toFixed(2)}`}</Text>
              </View>

              <View style={{ marginVertical: 5 }}>
                <Text style={{ backgroundColor: "yellow" }}>
                  Alto 12% a 18%
                </Text>
                <Text>{`de R$ ${(
                  data[0].mainPrice * 0.121 +
                  data[0].mainPrice
                ).toFixed(2)} a R$ ${(
                  data[0].mainPrice * 0.18 +
                  data[0].mainPrice
                ).toFixed(2)}`}</Text>
              </View>

              <View style={{ marginVertical: 5 }}>
                <Text style={{ backgroundColor: "red" }}>Padrão 5% a 11%</Text>
                <Text>{`de R$ ${(
                  data[0].mainPrice * 0.05 +
                  data[0].mainPrice
                ).toFixed(2)} a R$ ${(
                  data[0].mainPrice * 0.12 +
                  data[0].mainPrice
                ).toFixed(2)}`}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
