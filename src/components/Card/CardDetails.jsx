import Hashtag from "../Hashtag";
import { useContext} from "react";
import DataContext from "@context/DataContext";

export default function CardDetails({value}) {
  const [selectedCardOptions] = useContext(DataContext).selectedCardOptions;
  return (
    <div id="card-details" className={`bg-white flex flex-col overflow-hidden ${selectedCardOptions.includes("Frame") && selectedCardOptions.length === 1 || !selectedCardOptions.length ? null : "m-6"} gap-1`}>
      {selectedCardOptions.includes("Title") && (
        <h1 className="text-[1.4em] mb-2 font-medium">{value.title}</h1>
      )}
      {selectedCardOptions.includes("Description") && (
        <p className="leading-5 font-regular pr-3 text-[0.9em] text-slate-950/70">
          {value.notes}
        </p>
      )}
      {selectedCardOptions.includes("Hashtags") && (
        <div id="hashtags" className="flex flex-row gap-3">
          {value.tags.map((tag) => {
            return(
            <Hashtag to={`${tag}`}>#{tag}</Hashtag>
            )
          })}
        </div>
      )}
    </div>
  );
}
