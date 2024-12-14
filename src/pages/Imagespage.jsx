import { useContext, useState } from "react";

import Wrapper from "@layout/others/Wrapper";
import Cards from "@layout/Cards";
import CardImage from "@components/Card/CardImage";
import DataContext from "@context/DataContext";
import { deleteData } from "@utils/deleteCard";

import { Link } from "react-router-dom";
import CardsMenu from "@components/CardsTab/CardsMenu";

const Imagespage = () => {
  const [data, setData] = useContext(DataContext).data;
  const [cardsMenuShow, setCardsMenuShow] = useState(false);
  const [selectedCardOptions, setSelectedCardOptions] =
    useContext(DataContext).selectedCardOptions;
  const [inputRange, setInputRange] = useContext(DataContext).inputRange;
  const handleInputRadio = (e) => {
    const value = e.target.value;
    setSelectedCardOptions((currentVal) =>
      currentVal.includes(value)
        ? currentVal.filter((i) => i !== value)
        : [...selectedCardOptions, value]
    );
  };

  return (
    <>
      <Wrapper className="flex flex-col gap-6 py-5 pb-10">
        <div id="tabcards" className="flex flew-row justify-between">
          <div className="flex flex-row gap-2">
            <Link
              to="/"
              className="px-4 py-1 text-slate-950 bg-white rounded-full"
            >
              All
            </Link>
            <Link
              to="/images"
              className="px-4 py-1 bg-slate-950 text-white rounded-full"
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
            <div className="cursor-pointer">
              <div onClick={() => setCardsMenuShow(!cardsMenuShow)}>Cards</div>
              {cardsMenuShow && (
                <CardsMenu
                  inputRange={inputRange}
                  setInputRange={setInputRange}
                  selectedCardOptions={selectedCardOptions}
                  handleInputRadio={handleInputRadio}
                />
              )}
            </div>
          </div>
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
