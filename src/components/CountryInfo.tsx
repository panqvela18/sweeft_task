import { Box } from "@mui/material";
import DetailCountryInfo from "./DetailCountryInfo";
import { useEffect, useState } from "react";
import api from "../api/getCountryData";
import AirportAndCurrencyInfo from "./AirportAndCurrencyInfo";
import { CountryType } from "../types/types";

const neighbourCache: any = {};

export default function CountryInfo({
  name,
  capital,
  continents,
  currencies,
  borders,
  region,
  subregion,
  population,
  flags,
  currentCurrency,
  cca2,
  handleTabChange,
  tabValue,
}: CountryType) {
  const [neighboursInfo, setNeighboursInfo] = useState<CountryType[]>();

  const fetchNeighbours = async (borders: string[]) => {
    try {
      const resp = await api.get(`alpha?codes=${borders.join(",")}`);
      setNeighboursInfo(resp.data);
      neighbourCache[borders.join(" ")] = resp.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setNeighboursInfo([]);
    if (borders) {
      if (neighbourCache[borders.join(" ")]) {
        setNeighboursInfo(neighbourCache[borders.join(" ")]);
      } else {
        fetchNeighbours(borders);
      }
    }
  }, [borders]);
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
      <div className="flex item-center">
        <h4 className="font-bold text-xl">{name.official}</h4>
        <img className="h-[30px] ml-[10px] " src={flags.svg} alt={flags.alt} />
      </div>
      <div className="flex mt-4 max-md:flex-col">
        <div className="w-1/2 max-md:w-full">
          <DetailCountryInfo
            name="Capital"
            value={capital ? capital.join(",") : ""}
          />
          <DetailCountryInfo
            name="Currency"
            value={`${Object.values(currencies)[0].name} ${
              Object.values(currencies)[0].symbol
            }`}
          />

          <DetailCountryInfo name="Region" value={`${region}, ${subregion}`} />
        </div>
        <div className="w-1/2 max-md:w-full">
          <DetailCountryInfo name="Continet" value={continents.join(", ")} />
          <DetailCountryInfo
            name="Population"
            value={`${population.toLocaleString("eu-US")}`}
          />
          <DetailCountryInfo
            name="Borders"
            value={
              neighboursInfo
                ? neighboursInfo
                    ?.map((neighbour) => neighbour.name.common)
                    .join(", ")
                : ""
            }
          />
        </div>
      </div>
      <AirportAndCurrencyInfo
        currencySymbol={`${Object.values(currencies)[0].symbol}`}
        currentCurrency={currentCurrency}
        mainSelectedCountry={name.common}
        cca2={cca2}
        handleTabChange={handleTabChange}
        tabValue={tabValue}
      />
    </Box>
  );
}
