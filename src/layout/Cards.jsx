import { useContext} from "react";
import DataContext from "@context/DataContext";
export default function Cards({ children }) {
  const [inputRange] = useContext(DataContext).inputRange;
  return (
    <div id="cards" className={`gap-4`} style={{columnCount:inputRange}}>
      {children}
    </div>
  );
}
