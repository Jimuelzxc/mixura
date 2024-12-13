import CardMenu from "./CardMenu";
import CardDetails from "./CardDetails";
import CardWrapper from "./CardWrapper";
export default function CardImage({ value, onClick }) {
  return (
    <CardWrapper>
      <div className="rounded-t-md overflow-hidden relative cursor-pointer bg-slate-700 border-b border-slate-950">
        <div className="bg-white absolute px-2 opacity-90 rounded-full left-0 m-3 border shadow-sm z-20 text-[0.8em]">
          {value.ext === "gif" ? "GIF" : "image"}
        </div>
        <CardMenu onClick={onClick} />
        <a href={value.url}>
          <img src={value.url} alt="" className="w-full" />
        </a>
      </div>
      <CardDetails />
    </CardWrapper>
  );
}
