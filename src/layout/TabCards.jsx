import { Link } from "react-router-dom";
export default function TabCards() {
  return (
    <div id="tabcards" className="flex flew-row justify-between">
      <div className="flex flex-row gap-7">
        <Link to="/" className="px-5 bg-slate-950 text-white rounded-full">All</Link>
        <Link to="/images">Images</Link>
        <Link to="/videos">Videos</Link>
      </div>
      <div className="flex flex-row gap-7">
        <div>Filter</div>
        <div>Cards</div>
      </div>
    </div>
  );
}

