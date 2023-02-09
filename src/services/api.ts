import axios from "axios";
import { DOLLAR_API_URL, ARABICA_API_URL } from "@env";

const apiDollar = axios.create({
  baseURL: DOLLAR_API_URL,
});

const apiArabica = axios.create({
  baseURL: ARABICA_API_URL,
});

export { apiDollar, apiArabica };
