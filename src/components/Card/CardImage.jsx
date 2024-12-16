import CardMenu from "./CardMenu";
import CardDetails from "./CardDetails";
import { useContext, useEffect } from "react";
import CardWrapper from "./CardWrapper";
import DataContext from "@context/DataContext";
export default function CardImage({ value, onClick }) {
  const [selectedCardOptions] = useContext(DataContext).selectedCardOptions;
  return (
    <CardWrapper>
      <div className="rounded-t-md overflow-hidden relative cursor-pointer bg-slate-700 group">
        <div className="bg-white absolute px-2 opacity-90 rounded-full left-0 m-3 shadow-sm z-20 text-[0.8em]">
          {value.ext === "gif" ? "GIF" : "image"}
        </div>
        <CardMenu onClick={onClick}/>
        {selectedCardOptions.includes("Frame") && (
          <a href={value.url}>
            <img src={value.url} alt="" className="w-full" />
          </a>
        )}
      </div>
      <CardDetails />
    </CardWrapper>
  );
}
