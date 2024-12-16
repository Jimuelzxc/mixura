import Hashtag from "../Hashtag";
import { useContext} from "react";
import DataContext from "@context/DataContext";

export default function CardDetails() {
  const [selectedCardOptions] = useContext(DataContext).selectedCardOptions;
  return (
    <div id="card-details" className={`bg-white flex flex-col overflow-hidden ${selectedCardOptions.includes("Frame") && selectedCardOptions.length === 1 || !selectedCardOptions.length ? null : "m-6"} gap-1`}>
      {selectedCardOptions.includes("Title") && (
        <h1 className="text-[1.4em] mb-2 font-medium">Lorem ipsum</h1>
      )}
      {selectedCardOptions.includes("Description") && (
        <p className="leading-5 font-regular pr-3 text-[0.9em] text-slate-950/70">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
          necessitatibus itaque provident.
        </p>
      )}
      {selectedCardOptions.includes("Hashtags") && (
        <div id="hashtags" className="flex flex-row gap-3">
          <Hashtag to="/hashtags">#loremipsum</Hashtag>
          <Hashtag to="/hashtags">#lorem</Hashtag>
          <Hashtag to="/hashtags">#ipsum</Hashtag>
        </div>
      )}
    </div>
  );
}
