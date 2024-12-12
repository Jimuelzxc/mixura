import { useContext, useEffect } from "react";

import Wrapper from "@layout/others/Wrapper";
import Cards from "@layout/Cards";
import CardImage from "@components/Cards/CardImage";
import CardVideo from "@components/Cards/CardVideo";
import DataContext from "@context/DataContext";
import { deleteData } from "@utils/deleteCard";

import { Link } from "react-router-dom";

const Mainpage = () => {
  const [data, setData] = useContext(DataContext);
  return (
    <>
      <Wrapper className="flex flex-col gap-6 ">
        <div id="tabcards" className="flex flew-row justify-between">
          <div className="flex flex-row gap-2">
            <Link
              to="/"
              className="px-4 py-1 bg-slate-950 text-white rounded-full"
            >
              All
            </Link>
            <Link
              to="/images"
              className="px-4 py-1 text-slate-950 bg-white rounded-full"
            >
              Images
            </Link>
            <Link
              to="/videos"
              className="px-4 py-1 text-slate-950 bg-white rounded-full"
            >
              Videos
            </Link>
          </div>
          <div className="flex flex-row gap-7">
            <div>Filter</div>
            <div>Cards</div>
          </div>
        </div>

        <Cards>
          {data.map((value, index) => {
            if (value.type === "image") {
              return (
                <CardImage
                  key={index}
                  value={value}
                  onClick={() => deleteData(index, data, setData)}
                />
              );
            } else {
              return (
                <CardVideo
                  key={index}
                  value={value}
                  onClick={() => deleteData(index, data, setData)}
                />
              );
            }
          })}
        </Cards>
      </Wrapper>
    </>
  );
};
export default Mainpage;
