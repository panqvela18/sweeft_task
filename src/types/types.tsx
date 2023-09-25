export type CountryType = {
  name: CountryNameType;
  capital: string[];
  region: string;
  subregion: string;
  continents: string[];
  population: number;
  borders: string[];
  currencies: Object;
  flags: FlagsType;
  currentCurrency: any;
  cca2?: string;
  handleTabChange?: Function;
  tabValue?: string;
};

type CountryNameType = {
  common: string;
  official: string;
};

type FlagsType = {
  png: string;
  svg: string;
  alt: string;
};

export type currencySymbol = {
  symbol: string;
};

export type airports = {
  iata: string;
  name: string;
  city: string;
};

export type GeoLocationCountryType = {
  results: GeoLocationAddressType[];
};

type GeoLocationAddressType = {
  formatted_address: string;
};
