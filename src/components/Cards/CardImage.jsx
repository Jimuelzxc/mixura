import Hashtag from "@components/Hashtag";
import { useState } from "react";
import CardMenu from "./CardMenu";
export default function CardImage({ value, onClick }) {
  return (
    <div id="card" className="flex flex-col  break-inside-avoid mb-5 border rounded-md overflow-hidden shadow-lg hover:scale-[1.02]  hover:border-2 hover:border-slate-950 p-2">
      <div className="group rounded-t-md overflow-hidden relative cursor-pointer">
        <div className="bg-white absolute px-2 opacity-90 rounded-full left-0 m-3 border shadow-sm z-20 text-[0.8em]">
          {value.ext === "gif" ? "GIF" : "image"}
        </div>
        <CardMenu onClick={onClick} />
        <a href={value.url}>
          <img src={value.url} alt="" className="w-full"/>
        </a>
      </div>
      <div id="card-details" className="p-6">
        <h1 className="text-[1.4em]">Motion #1</h1>
        <p className="mb-2 leading-5 font-regular pr-3">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
          necessitatibus itaque provident.
        </p>
        <div id="hashtags" className="flex gap-2">
          <Hashtag to="/hashtags">#motiondesign</Hashtag>
        </div>
      </div>
    </div>
  );
}
