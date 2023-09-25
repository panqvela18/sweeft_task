type DetailCountryInfo = {
  name: string;
  value: string;
};

export default function DetailCountryInfo({ name, value }: DetailCountryInfo) {
  return (
    <div className="flex items-start">
      <span className="text-base font-semibold w-1/4 max-md:w-1/2">{name}</span>
      <span className="text-sm w-3/4 max-md:w-1/2">{value}</span>
    </div>
  );
}
