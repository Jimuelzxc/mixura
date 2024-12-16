import { useState, useContext } from "react";
import CardsMenu from "@components/CardsTab/CardsMenu";
import DataContext from "@context/DataContext";
import Wrapper from "@layout/others/Wrapper";


import Tab from "@components/CardsTab/Tab";
export default function TabCards() {
  const [cardsMenuShow, setCardsMenuShow] = useState(false);
  const [inputRange, setInputRange] = useContext(DataContext).inputRange;
  const [selectedCardOptions, setSelectedCardOptions] =
    useContext(DataContext).selectedCardOptions;
  const handleInputRadio = (e) => {
    const value = e.target.value;
    setSelectedCardOptions((currentVal) =>
      currentVal.includes(value)
        ? currentVal.filter((i) => i !== value)
        : [...selectedCardOptions, value]
    );
  };
  return (
    <Wrapper>
      <div id="tabcards" className="flex flew-row justify-between">
        <div className="flex flex-row gap-2"> 
          <Tab path="/" name="All"/>
          <Tab path="/images" name="Images"/>
          <Tab path="/videos" name="Videos"/>
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
    </Wrapper>
  );
}
