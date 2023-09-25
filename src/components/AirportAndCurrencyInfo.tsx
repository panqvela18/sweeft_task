import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import CurrencyInfo from "./CurrencyInfo";
import AirportInfo from "./AirportInfo";

export default function AirportAndCurrencyInfo({
  currencySymbol,
  currentCurrency,
  mainSelectedCountry,
  cca2,
  handleTabChange,
  tabValue,
}: any) {
  return (
    <div className="my-6">
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            className="max-md:flex flex-col"
            onChange={handleTabChange}
            aria-label="lab API tabs example"
          >
            <Tab label="CURRENCY EXCHANGE" value="Currency" />
            <Tab label="AIRPORTS" value="Airport" />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 0 }} value="Currency">
          <CurrencyInfo
            currencySymbol={currencySymbol}
            currentCurrency={currentCurrency}
            mainSelectedCountry={mainSelectedCountry}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="Airport">
          <AirportInfo cca2={cca2} />
        </TabPanel>
      </TabContext>
    </div>
  );
}
