import CardImage from "@components/Cards/CardImage";
import CardVideo from "@components/Cards/CardVideo";
import DataContext from "@context/datacontext";
import { useContext, useEffect } from "react";
import { deleteData } from "@utils/deleteCard";

export default function Cards() {
  const [data, setData] = useContext(DataContext);
  return (
    <div id="cards" className="columns-1 lg:columns-3 md:columns-2">
      {data.map((value, index) => {
        if (value.type === "image") {
          return (
            <CardImage
              key={index}
              value={value}
              onClick={() => deleteData(index, data, setData)}
            />
          );
        } else {
          return (
            <CardVideo
              key={index}
              value={value}
              onClick={() => deleteData(index, data, setData)}
            />
          );
        }
      })}
    </div>
  );
}
