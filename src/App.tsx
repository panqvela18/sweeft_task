import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import CountryInfo from "./components/CountryInfo";
import api from "./api/getCountryData";
import { CountryType } from "./types/types";
import "../src/App.css";
import axios from "axios";

export const countriesCache: any = {};
export const allCountriesCache: any = {};

function App() {
  const [currLocation, setCurrLocation] = useState<GeolocationCoordinates>();
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [error, setError] = useState("");
  const [selectCountry, setSelectCountry] = useState<string>("");
  const [selectedCountryInfo, setSelectedCountryInfo] =
    useState<CountryType[]>();

  const [tabValue, setTabValue] = useState<string>("Currency");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);

    const queryString = `?country=${selectCountry}&tab=${newValue}`;

    window.history.pushState(null, "", queryString);
  };

  console.log(tabValue);

  const currenciesKeyassArray =
    selectedCountryInfo && Object.keys(selectedCountryInfo[0]?.currencies);

  const currenciesKeyString = currenciesKeyassArray && currenciesKeyassArray[0];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const country: any = urlParams.get("country");
    const tab: any = urlParams.get("tab");

    if (country === "" || country === null) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => setCurrLocation(position.coords),
        (err) => console.log(err)
      );
      setTabValue(tabValue);
    } else {
      setSelectCountry(country);
      setTabValue(tab);
    }
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          currLocation?.latitude
        },${currLocation?.longitude}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
      );
      const address_components_array =
        response.data.results[5].address_components;
      const country =
        address_components_array[address_components_array.length - 1].long_name;
      setSelectCountry(country);

      const queryString = `?country=${selectCountry}&tab=${tabValue}`;

      window.history.pushState(null, "", queryString);
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    if (currLocation) {
      fetchCustomerInfo();
    }
  }, [currLocation]);

  const fetchCountries = async () => {
    try {
      const response = await api.get("all?fields=name");
      setCountries(response.data);
      allCountriesCache["value"] = response.data;
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
    if (allCountriesCache["value"]) {
      setCountries(allCountriesCache["value"]);
    } else {
      fetchCountries();
    }
  }, []);
  useEffect(() => {
    if (selectCountry) {
      if (countriesCache[selectCountry]) {
        setSelectedCountryInfo([countriesCache[selectCountry]]);
      } else {
        fetchCountryInfo(selectCountry);
        const queryString = `?country=${selectCountry}&tab=${tabValue}`;
        window.history.pushState(null, "", queryString);
      }
    }
  }, [selectCountry]);

  const handleChange = (event: any, value: any) => {
    const newValue = event.target.value as string;
    setSelectCountry(newValue);
  };

  return (
    <>
      <div className="justify-center mt-2  px-[10%]">
        <Box
          maxWidth={1024}
          marginX={"auto"}
          sx={{ p: 3, border: "1px solid rgb(204,204,204)" }}
        >
          <FormControl className="w-full">
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectCountry}
              label="Country"
              onChange={handleChange}
              MenuProps={{
                style: { maxHeight: "300px" },
              }}
            >
              {countries?.map((country) => (
                <MenuItem key={country.name.common} value={country.name.common}>
                  {country.name.common}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {currenciesKeyString && selectedCountryInfo && (
            <CountryInfo
              name={selectedCountryInfo[0].name}
              capital={selectedCountryInfo[0].capital}
              region={selectedCountryInfo[0].region}
              subregion={selectedCountryInfo[0].subregion}
              population={selectedCountryInfo[0].population}
              borders={selectedCountryInfo[0].borders}
              currencies={selectedCountryInfo[0].currencies}
              continents={selectedCountryInfo[0].continents}
              flags={selectedCountryInfo[0].flags}
              currentCurrency={currenciesKeyString}
              cca2={selectedCountryInfo[0].cca2}
              handleTabChange={handleTabChange}
              tabValue={tabValue}
            />
          )}
        </Box>
      </div>
    </>
  );
}

export default App;
