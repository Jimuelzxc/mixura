import Hashtag from "@components/Hashtag";
import { useState } from "react";
import CardMenu from "./CardMenu";
export default function CardImage({ value, onClick }) {
  return (
    <div id="card" className="flex flex-col gap-2 break-inside-avoid mb-10">
      <div className="group rounded-md overflow-hidden relative cursor-pointer">
        <div className="bg-white absolute px-3 py-1 rounded-full left-0 m-5 border shadow-sm z-20">{value.ext === "gif" ? "GIF":"image"}</div>
        <CardMenu onClick={onClick}/> 
        <img src={value.url} alt="" className="w-full"/>
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
