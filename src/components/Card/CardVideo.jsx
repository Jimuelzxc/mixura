import CardWrapper from "./CardWrapper";
import CardMenu from "./CardMenu";
import CardDetails from "./CardDetails";
import { useContext, useEffect } from "react";
import DataContext from "@context/DataContext";
export default function CardVideo({ value, onClick }) {
  const urlOBJ = new URL(value.url);
  const getParams = urlOBJ.searchParams.get("v");
  const [selectedCardOptions, setSelectedCardOptions] =
    useContext(DataContext).selectedCardOptions;
  return (
    <CardWrapper>
      <div className="rounded-t-md overflow-hidden relative">
        <div className="bg-white absolute px-2 py-1 text-[0.8em] rounded-full left-0 m-3 shadow-sm z-20">
          video
        </div>
        <CardMenu onClick={onClick} />
        {selectedCardOptions.includes("Frame") && (
          <iframe
            height="277"
            width="100%"
            src={`https://www.youtube.com/embed/${getParams}?autoplay=1&mute=1&loop=1&playlist=${getParams}&controls=0`}
            allow="autoplay; loop"
            allowFullScreen
            className=""
          ></iframe>
        )}
      </div>
      <CardDetails />
    </CardWrapper>
  );
}
