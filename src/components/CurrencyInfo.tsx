import {
  FormControl,
  Select,
  MenuItem,
  Box,
  InputAdornment,
  Input,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CountryType } from "../types/types";
import api from "../api/getCountryData";
import apiGetExchange from "../api/getExchangeData";
import { allCountriesCache, countriesCache } from "../App";

const exchangeCache: any = {};

export default function CurrencyInfo({
  currencySymbol,
  currentCurrency,
  mainSelectedCountry,
}: any) {
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [error, setError] = useState("");
  const [selectCountry, setSelectCountry] =
    useState<string>(mainSelectedCountry);
  const [currencyInput, setCurrencyInput] = useState<number>(0);
  const [selectedCountryInfo, setSelectedCountryInfo] =
    useState<CountryType[]>();

  const [exchange, setExchange] = useState<any>(null);

  const symbolArray =
    selectedCountryInfo && Object.values(selectedCountryInfo[0].currencies);

  const Symbol = symbolArray && symbolArray[0].symbol;

  const currenciesKeyassArray =
    selectedCountryInfo && Object.keys(selectedCountryInfo[0]?.currencies);
  const currenciesKeyString = currenciesKeyassArray && currenciesKeyassArray[0];

  useEffect(() => {
    const fetchCurrenciesExchange = async () => {
      if (currenciesKeyString) {
        try {
          const response = await apiGetExchange.get(
            `convert?from=${currentCurrency}&to=${currenciesKeyString}`
          );
          setExchange(response.data);
          exchangeCache[`${currentCurrency}${currenciesKeyString}`] =
            response.data;
        } catch (error: any) {
          setError(error);
        }
      }
    };

    if (currenciesKeyString) {
      if (exchangeCache[`${currentCurrency}${currenciesKeyString}`]) {
        setExchange(exchangeCache[`${currentCurrency}${currenciesKeyString}`]);
      } else {
        fetchCurrenciesExchange();
      }
    }
  }, [currenciesKeyString, currentCurrency]);

  const fetchCountries = async () => {
    try {
      const response = await api.get("all?fields=name");
      setCountries(response.data);
    } catch (error: any) {
      setError(error);
    }
  };

  const fetchCountryInfo = async (name: string) => {
    try {
      const response = await api.get(`name/${name}`);
      setSelectedCountryInfo(response.data);
      countriesCache[name] = response.data[0];
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    if (selectCountry) {
      if (countriesCache[selectCountry]) {
        setSelectedCountryInfo([countriesCache[selectCountry]]);
      } else {
        fetchCountryInfo(selectCountry);
      }
    }
  }, [selectCountry]);

  useEffect(() => {
    if (allCountriesCache["value"]) {
      setCountries(allCountriesCache["value"]);
    } else {
      fetchCountries();
    }
  }, []);

  console.log(currentCurrency);

  const handleChange = (event: any, value: any) => {
    const newValue = event.target.value as string;
    setSelectCountry(newValue);
  };

  return (
    <Box
      sx={{
        p: 2,
        marginTop: 3,
        borderRadius: "4px",
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
      }}
    >
      <h3 className="text-3xl font-medium mb-4">CurrencyInfo</h3>
      <FormControl variant="standard" sx={{ minWidth: 200, marginBottom: 5 }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectCountry}
          onChange={handleChange}
          MenuProps={{
            style: { maxHeight: "300px", width: "100px" },
          }}
        >
          {countries?.map((country) => (
            <MenuItem key={country.name.common} value={country.name.common}>
              {country.name.common}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="flex items-center ">
        <FormControl sx={{ width: "50%" }} variant="standard">
          <Input
            id="standard-adornment-amount"
            type="number"
            onChange={(e) => {
              setCurrencyInput(parseInt(e.target.value));
            }}
            value={currencyInput}
            startAdornment={
              <InputAdornment position="start">{currencySymbol}</InputAdornment>
            }
          />
        </FormControl>
        <span className="mx-2 font-bold ">=</span>
        <FormControl sx={{ width: "50%" }} variant="standard">
          <Input
            disabled
            type="number"
            id="standard-adornment-amount"
            startAdornment={
              <InputAdornment position="start">{Symbol}</InputAdornment>
            }
            value={(currencyInput * exchange?.result).toFixed(2)}
          />
        </FormControl>
      </div>
    </Box>
  );
}
