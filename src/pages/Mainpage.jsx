import { useContext} from "react";
import Wrapper from "@layout/others/Wrapper";
import Cards from "@layout/Cards";
import CardImage from "@components/Card/CardImage";
import CardVideo from "@components/Card/CardVideo";
import DataContext from "@context/DataContext";
import { deleteData } from "@utils/deleteCard";

const Mainpage = () => {
  const [data, setData] = useContext(DataContext).data;
  return (
    <Wrapper className="flex flex-col gap-6 py-5 pb-10">
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
  );
};
export default Mainpage;
