import { useContext } from "react";
import DataContext from "@context/DataContext";
export default function Cards({ children }) {
  const [inputRange] = useContext(DataContext).inputRange;
  return (
    <div id="cards" className={`columns-${inputRange} gap-4`}>
      {children}
    </div>
  );
}
