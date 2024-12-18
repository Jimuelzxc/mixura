import { useContext} from "react";
import Wrapper from "@layout/others/Wrapper";
import Cards from "@layout/Cards";
import CardImage from "@components/Card/CardImage";
import DataContext from "@context/DataContext";
import { deleteData } from "@utils/deleteCard";


import ParentContainer from "@layout/others/ParentContainer";
const Imagespage = () => {
  const [data, setData] = useContext(DataContext).data;
  return (
    <ParentContainer>
    <Wrapper className="flex flex-col gap-6 py-5 pb-10">
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
    </ParentContainer>

  );
};
export default Imagespage;
