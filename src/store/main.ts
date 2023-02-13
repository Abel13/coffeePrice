import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import produce from "immer";
import { apiArabica, apiDollar } from "../services/api";
import { EXCHANGE_RATES_KEY } from "@env";
import dayjs from "dayjs";

export interface IPrice {
  date: Date;
  arabicaPrice: number;
  dollarPrice: number;
  oldPrice: number;
}

interface IMainState {
  currentDollarPrice: number;
  currentArabicaPrice: number;
  currentDate: Date;
  dataLoaded: boolean;
  data: IPrice[];
}

interface IMainStore {
  state: IMainState;
  getData: () => Promise<void>;
  resetCurrentData: () => void;
}

interface IExchangeData {
  base: string;
  to: string;
  amount: number;
  converted: number;
  rate: number;
}

const initialState: IMainState = {
  currentDollarPrice: 0,
  currentArabicaPrice: 0,
  currentDate: dayjs().toDate(),
  dataLoaded: true,
  data: [],
};

export const useMainStore = create<IMainStore>()(
  persist(
    (set, get) => ({
      state: initialState,
      resetCurrentData: () => {
        const currentData = get().state.data.find((d) => {
          return (
            dayjs(d.date).format("YYYY/MM/DD") === dayjs().format("YYYY/MM/DD")
          );
        });

        if (
          currentData?.date &&
          dayjs(currentData.date).add(6, "hour") < dayjs()
        )
          set(
            produce(({ state }: IMainStore) => {
              state.currentDollarPrice = 0;
              state.currentArabicaPrice = 0;
              state.dataLoaded = false;
            })
          );
      },
      getData: async () => {
        console.log(
          "🚀 ~ file: main.ts:77 ~ getData: ~ get().state.dataLoaded",
          get().state.dataLoaded
        );
        if (get().state.dataLoaded) return;

        await getDollar(get, set);
        console.log(
          "🚀 ~ file: main.ts:81 ~ getData: ~ getDollar",
          get().state.currentDollarPrice
        );

        await getArabicaPrice(get, set);
        console.log(
          "🚀 ~ file: main.ts:85 ~ getData: ~ getArabicaPrice",
          get().state.currentArabicaPrice
        );

        if (
          get().state.currentArabicaPrice !== 0 &&
          get().state.currentDollarPrice !== 0
        ) {
          const list = [...get().state.data];
          const lastItem = list[list.length - 1];
          console.log("🚀 ~ file: main.ts:90 ~ getData: ~ lastItem", lastItem);

          const filteredList = list.filter((d) => {
            return (
              dayjs(d.date).format("YYYY/MM/DD") !==
              dayjs().format("YYYY/MM/DD")
            );
          });

          const oldPrice = lastItem
            ? lastItem.dollarPrice * lastItem.arabicaPrice
            : get().state.currentArabicaPrice * get().state.currentDollarPrice;

          filteredList.push({
            date: dayjs().toDate(),
            arabicaPrice: get().state.currentArabicaPrice,
            dollarPrice: get().state.currentDollarPrice,
            oldPrice,
          });
          const newList = filteredList.sort((a, b) => {
            const dateA = dayjs(a.date);
            const dateB = dayjs(b.date);
            return dateA.diff(dateB);
          });

          set(
            produce(({ state }: IMainStore) => {
              state.data = newList.reverse();
              state.currentDate = dayjs().toDate();
              state.dataLoaded = true;
            })
          );
        }
      },
    }),
    {
      name: "auth-user",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

async function getArabicaPrice(
  get: () => IMainStore,
  set: (
    partial:
      | IMainStore
      | Partial<IMainStore>
      | ((state: IMainStore) => IMainStore | Partial<IMainStore>),
    replace?: boolean | undefined
  ) => void
) {
  if (get().state.currentArabicaPrice === 0 && !get().state.dataLoaded) {
    try {
      const { data } = await apiArabica.get(
        "/commodities/us-coffee-c?utm_source=investing_app&utm_medium=share_link&utm_campaign=share_instrument"
      );

      const index = data.indexOf(`data-test="instrument-price-last"`);
      const rest = data.substring(index + 34);
      const indexSpan = rest.indexOf("</span>");
      const price = rest.substring(0, indexSpan);

      set(
        produce(({ state }: IMainStore) => {
          state.currentArabicaPrice = Number(price.replace(",", "."));
        })
      );
    } catch (error) {
      console.log("🚀 ~ file: main.ts:124 ~ error", error.response);
    }
  }
}

async function getDollar(
  get: () => IMainStore,
  set: (
    partial:
      | IMainStore
      | Partial<IMainStore>
      | ((state: IMainStore) => IMainStore | Partial<IMainStore>),
    replace?: boolean | undefined
  ) => void
) {
  try {
    if (get().state.currentDollarPrice === 0 && !get().state.dataLoaded) {
      const { data } = await apiDollar.get<IExchangeData>("/convert", {
        params: {
          base: "USD",
          to: "BRL",
          amount: 1,
          apiKey: EXCHANGE_RATES_KEY,
        },
      });
      const { rate } = data;

      set(
        produce(({ state }: IMainStore) => {
          state.currentDollarPrice = rate;
        })
      );
    }
  } catch (error) {
    console.log("🚀 ~ file: main.ts:159 ~ error", error.request);
  }
}
