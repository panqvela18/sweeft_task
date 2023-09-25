import { Box, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import getAirport from "../api/getAirport";
import { airports } from "../types/types";
import Airport from "./Airport";

const airportCache: any = {};

export default function AirportInfo({ cca2 }: any) {
  const [airports, setAirports] = useState<airports[]>();
  const [searchInput, setSearchInput] = useState("");
  const [filteredAirports, setFilteredAirports] = useState<airports[]>();

  const fetchAirport = async (name: string) => {
    try {
      const response = await getAirport.get(`/airports?country=${name}`);
      setAirports(response.data);
      airportCache[name] = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (airportCache[cca2]) {
      setAirports(airportCache[cca2]);
    } else {
      fetchAirport(cca2);
    }
  }, [cca2]);

  useEffect(() => {
    const delayedFilter = setTimeout(() => {
      if (airports) {
        setFilteredAirports(
          airports
            .filter((airport) => airport.iata)
            .filter((airport) =>
              airport.name
                .toLocaleUpperCase()
                .includes(searchInput.toLocaleUpperCase())
            )
        );
      }
    }, 500);

    return () => clearTimeout(delayedFilter);
  }, [searchInput, airports]);
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
      <h3 className="text-3xl font-medium mb-4">AirportInfo</h3>
      <TextField
        sx={{ marginTop: 2 }}
        id="standard-basic"
        label="Search for airport"
        variant="standard"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="columns-2 max-md:columns-1">
        {searchInput
          ? filteredAirports &&
            filteredAirports.map((airport) => {
              return (
                <Airport
                  city={airport.city}
                  key={airport.iata}
                  name={airport.name}
                  iata={airport.iata}
                />
              );
            })
          : airports &&
            airports
              .filter((airport) => airport.iata)
              .filter((airport) =>
                airport.name
                  .toLocaleUpperCase()
                  .includes(searchInput.toLocaleUpperCase())
              )
              .map((airport) => {
                return (
                  <Airport
                    city={airport.city}
                    key={airport.iata}
                    name={airport.name}
                    iata={airport.iata}
                  />
                );
              })}
      </div>
    </Box>
  );
}
