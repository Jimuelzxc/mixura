import DataContext from "@context/datacontext";
import { useContext, useEffect } from "react";

export default function Cards({children}) {
  return (
    <div id="cards" className="columns-2 lg:columns-3 md:columns-2">
      {children}
    </div>
  );
}
