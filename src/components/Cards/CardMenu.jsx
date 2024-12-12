import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
export default function CardMenu({onClick}) {
  const [isToggle, setIsToggle] = useState(false);
  return (
    <div className="hidden group-hover:block">
      <div
        className="absolute right-0 m-5 p-2 rounded-full bg-white border border-slate-200 shadow-md z-10 cursor-pointer"
        onClick={() => setIsToggle(!isToggle)}
      >
        <BsThreeDots className="text-[1.4em]" />
      </div>
      {isToggle && (
        <div className="bg-white absolute right-0  translate-y-[65px] translate-x-[-22px] rounded-md p-4 w-[120px] border shadow-sm cursor-pointer" onClick={onClick}>
          Delete Card
        </div>
      )}
    </div>
  );
}
