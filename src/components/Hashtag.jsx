import { Link } from "react-router-dom";
export default function Hashtag({children, to}) {
  return (
    <Link className="text-blue-800 rounded-full text-[0.8em]" to={to}>{children}</Link>
  );
}
