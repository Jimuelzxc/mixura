import CardMenu from "./CardMenu";
import CardDetails from "./CardDetails";
import { useContext} from "react";
import CardWrapper from "./CardWrapper";
import DataContext from "@context/DataContext";
export default function CardImage({ value, onClick }) {
  const [selectedCardOptions] = useContext(DataContext).selectedCardOptions;
  const [selectedData, setSelectedData] = useContext(DataContext).selectedData;
  return (
    <CardWrapper>
      <div className="rounded-t-md overflow-hidden relative cursor-pointer bg-slate-700 group">
        <div className="bg-white absolute px-2 opacity-90 rounded-full left-0 m-3 shadow-sm z-20 text-[0.8em]">
          {value.ext === "gif" ? "GIF" : "image"}
        </div>
        <CardMenu onClick={onClick} />
        {selectedCardOptions.includes("Frame") && (
          <img src={value.url} alt="" className="w-full" onClick={() => setSelectedData(value)}/>
        )}
      </div>
      <CardDetails value={value}/>
    </CardWrapper>
  );
}
