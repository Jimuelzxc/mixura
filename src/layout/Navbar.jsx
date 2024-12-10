import { useEffect, useRef, useState } from "react";
import Wrapper from "@layout/others/Wrapper";
import SaveBarInput from "@components/Navbar/SaveBarInput";
import Settings from "@components/Navbar/Settings";

import { useInput } from "@hooks/useInput";
import { addDataFromLocalStorage } from "@database/localstorage";

const Navbar = () => {
  const [data, setData] = useState([]);
  const savebarInput = useInput();
  useEffect(() => {
    savebarInput.ref.current.focus();
  }, [savebarInput.value]);
  useEffect(() => {
    addDataFromLocalStorage(data);
  }, [data]);

  const addImageCard = () => {
    const imgext = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const getimgext = savebarInput.value.split(".").pop()  
    imgext.some((ext) => savebarInput.value.endsWith(ext)) ? setData([...data, { url: savebarInput.value, type:"image", ext: getimgext}]): alert(false)
  }

  const addVideoCard = () => {
    
  }

  return (
    <div className=" py-4 border-b fixed top-0 w-full bg-white">
      <Wrapper className="flex flex-row justify-between items-center w-full">
        <h1 className="text-[1.5em]">Mixura.</h1>
        <SaveBarInput
          inputRef={savebarInput.ref}
          value={savebarInput.value}
          onChange={savebarInput.handleOnChange}
          onKeyDown={(e) => (e.key === "Enter" ? addImageCard() : null)}
        />
        <Settings />
      </Wrapper>
    </div>
  );
};

export default Navbar;
