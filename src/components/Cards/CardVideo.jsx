import Hashtag from "@components/Hashtag";
import CardMenu from "./CardMenu";
export default function CardVideo({value, onClick}) {
  const urlOBJ = new URL(value.url)
  const getParams = urlOBJ.searchParams.get("v")
  return (
    <div id="card" className="flex flex-col gap-2 break-inside-avoid mb-5 rounded-md overflow-hidden hover:scale-[1.02] cursor-pointer  hover:border-2 hover:border-slate-950 p-2 border shadow-md">
      <div className="rounded-md overflow-hidden relative group">
        <div className="bg-white absolute px-2 py-1 text-[0.8em] rounded-full left-0 m-3 border shadow-sm z-20">
          video
        </div>
        <CardMenu onClick={onClick}/>
        <iframe height="278" width="100%" src={`https://www.youtube.com/embed/${getParams}?autoplay=1&mute=1&loop=1&playlist=${getParams}&controls=0`} allow="autoplay; loop" allowFullScreen></iframe>
      </div>
      {/*<div id="card-details" className="">
        <h1 className="text-[1.4em]">Motion #1</h1>
        <p className="mb-3">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
          necessitatibus itaque provident.
        </p>
        <div id="hashtags" className="flex gap-2">
          <Hashtag to="/hashtags">#motiondesign</Hashtag>
        </div>
      </div> */}
    </div>
  );
}
