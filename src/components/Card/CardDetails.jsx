import Hashtag from "../Hashtag";
import { useContext, useEffect } from "react";
import DataContext from "@context/DataContext";

export default function CardDetails() {
  const [selectedCardOptions, setSelectedCardOptions] =
    useContext(DataContext).selectedCardOptions;
  return (
    <div id="card-details" className={`bg-white flex flex-col ${selectedCardOptions.includes("Frame") && selectedCardOptions.length === 1 || !selectedCardOptions.length ? null : "m-4"}`}>
      {selectedCardOptions.includes("Title") && (
        <h1 className="text-[1.4em]">Motion #1</h1>
      )}
      {selectedCardOptions.includes("Description") && (
        <p className="leading-5 font-regular pr-3 text-[0.9em]">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
          necessitatibus itaque provident.
        </p>
      )}
      {selectedCardOptions.includes("Hashtags") && (
        <div id="hashtags" className="flex gap-2">
          <Hashtag to="/hashtags">#motiondesign</Hashtag>
        </div>
      )}
    </div>
  );
}
