import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function Tab({path, name}) {
  const location = useLocation().pathname; 
  const tabstyle = location === path ? "bg-slate-950 text-white" : "text-slate-950 bg-white"  
  return (
    <Link
      to={path}
      className={`px-4 py-1 rounded-full ${tabstyle}`}>
      {name}
    </Link>
  );
}
