import { airports } from "../types/types";

export default function Airport({ iata, name, city }: airports) {
  return (
    <div className="flex items-start mt-2">
      <h5 className="font-bold">{iata.toUpperCase()}</h5>
      <span> - </span>
      <span className="font-medium">{`${name} (${city})`}</span>
      <p className="mr-1"></p>
    </div>
  );
}
