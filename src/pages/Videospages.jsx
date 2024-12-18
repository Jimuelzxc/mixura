import { useContext } from "react";
import DataContext from "@context/DataContext";
import Wrapper from "@layout/others/Wrapper";
import Cards from "@layout/Cards";
import CardVideo from "@components/Card/CardVideo";
import { deleteData } from "@utils/deleteCard";
import ParentContainer from "../layout/others/ParentContainer";

const Videospage = () => {
  const [data, setData] = useContext(DataContext).data;
  return (
    <ParentContainer>
      <Wrapper className="flex flex-col gap-6 py-5 pb-10">
        <Cards>
          {data.map((value, index) => {
            return value.type === "video" ? (
              <CardVideo
                key={index}
                value={value}
                onClick={() => deleteData(index, data, setData)}
              />
            ) : null;
          })}
        </Cards>
      </Wrapper>
    </ParentContainer>
  );
};
export default Videospage;
