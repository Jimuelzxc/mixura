import { useContext, useEffect } from "react";

import Wrapper from "@layout/others/Wrapper";
import TabCards from "@layout/TabCards";
import Cards from "@layout/Cards";
import CardImage from "@components/Cards/CardImage";
import DataContext from "@context/datacontext";
import { deleteData } from "@utils/deleteCard";


import { Link } from "react-router-dom";


const Imagespage = () => {
  const [data, setData] = useContext(DataContext);
  return (
    <>
      <Wrapper className="flex flex-col gap-6">
        <div className="flex flex-row gap-2">
          <Link to="/" className="px-4 py-1 text-slate-950 bg-white rounded-full">
            All
          </Link>
          <Link to="/images" className="px-4 py-1 bg-slate-950 text-white rounded-full">Images</Link>
          <Link to="/videos" className="px-4 py-1 text-slate-950 bg-white rounded-full">Videos</Link>
        </div>
        <Cards>
          {data.map((value, index) => {
            return value.type === "image" ? (
              <CardImage
                key={index}
                value={value}
                onClick={() => deleteData(index, data, setData)}
              />
            ) : null;
          })}
        </Cards>
      </Wrapper>
    </>
  );
};
export default Imagespage;
