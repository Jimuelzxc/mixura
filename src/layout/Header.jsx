import { useContext, useEffect, useState } from "react";
import Wrapper from "@layout/others/Wrapper";
import { BsPencilSquare } from "react-icons/bs";
import ModalInput from "@components/modal/ModalInput";
import { useInput } from "@hooks/useInput";
import DataContext from "@context/DataContext"



export default function Title() {
  
  const [data, setData, nameboard, setNameboard] = useContext(DataContext)
  const [nameModalShow, setNameModalShow] = useState(false);
  const inputName = useInput();
  useEffect(() => {nameModalShow && inputName.ref.current.focus()}, [nameModalShow]);

  return (
    <Wrapper className="mt-[140px] mb-[20px] pt-[40px] flex justify-center items-center flex-row gap-2">
      {nameModalShow && (
        <ModalInput
          inputRef={inputName.ref}
          onChange={inputName.handleOnChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setNameboard(inputName.value);
              setNameModalShow(false);
            }
          }}
          value={inputName.value}
          done={() => {
            setNameboard(inputName.value);
            setNameModalShow(false);
          }}
          cancel={() => setNameModalShow(false)}
        />
      )}
      <h1 className=" text-[2em] text-center z-[2] flex flex-row">
        {nameboard}
      </h1>
      <BsPencilSquare
        className="text-[0.8em] cursor-pointer opacity-40 hover:opacity-100 translate-y-1"
        onClick={() => {
          setNameModalShow(!nameModalShow);
          inputName.setValue(nameboard);
        }}
      />
    </Wrapper>
  );
}
