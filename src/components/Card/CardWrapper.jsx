import { useContext } from "react";
import DataContext from "@context/DataContext";

export default function CardWrapper({ children }) {
  const [selectedCardOptions] = useContext(DataContext).selectedCardOptions;
  return (
    <div
      id="card"
      className={`flex flex-col  break-inside-avoid mb-5 border-slate-950/50 rounded-md overflow-hidden shadow-lg hover:scale-[1.02] bg-white ease-in-out duration-75 hover:border-2 hover:border-slate-950 ${
        !selectedCardOptions.length ? null : "border" // EMPTY SELECTED OPTION REMOVE BORDER
      }`}
    >
      {children}
    </div>
  );
}