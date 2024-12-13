import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useContext } from "react";
import DataContext from "@context/DataContext";

export default function CardMenu({onClick}) {
  const [data, setData] = useContext(DataContext);
  const [isToggle, setIsToggle] = useState(false);
  useEffect(() => {
    setIsToggle(false)
  },[data])
  // USE CONTEXT AND DATA TO CLOSE CARD MENU AFTER DELETE A CARD
  return (
    <div className="hidden group-hover:block">
      <div
        className="absolute right-0 m-5 p-2 rounded-full bg-white/90 border border-slate-200 shadow-md z-10 cursor-pointer"
        onClick={() => setIsToggle(!isToggle)}
      >
        <BsThreeDots className="text-[1.4em]" />
      </div>
      {isToggle && (
        <div className="bg-white/85 backdrop:-blur-sm absolute right-0  translate-y-[65px] translate-x-[-22px] rounded-md p-4 w-[120px] border shadow-sm cursor-pointer z-[10]" onClick={onClick}>
          Delete Card
        </div>
      )}
    </div>
  );
}
