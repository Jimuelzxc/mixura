export default function CardWrapper({children}) {
  return (
    <div
      id="card"
      className="flex flex-col  break-inside-avoid mb-5 border-[1px] border-slate-950/50 rounded-md overflow-hidden shadow-lg hover:scale-[1.02] bg-white ease-in-out duration-75 hover:border-2 hover:border-slate-950"
    >{children}</div>
  );
}
