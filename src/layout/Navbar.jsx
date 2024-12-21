import { useContext, useEffect, useState, useRef } from "react";

import Wrapper from "@layout/others/Wrapper";
import Logo from "@components/Navbar/Logo";
import SaveBarInput from "@components/Navbar/SaveBarInput";
import Settings from "@components/Navbar/Settings";
import { useInput } from "@hooks/useInput";
import { addCard } from "@utils/addCard";
import DataContext from "@context/DataContext";


import { useClickOutside } from "@hooks/useClickOutside";
const Navbar = () => {
  const [data, setData] = useContext(DataContext).data
  const [nameboard, setNameboard] = useContext(DataContext).title
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const savebarInput = useInput();

  useEffect(() => {
    savebarInput.ref.current.focus();
    savebarInput.setValue("");
  }, [data]);


  return (
    <div className=" py-5 border-b border-slate-950 fixed top-0 w-full bg-white/90 backdrop-blur-sm z-[99] shadow-md ">
      <Wrapper className="flex flex-row justify-between items-center w-full">
        <Logo />
        <SaveBarInput
          inputRef={savebarInput.ref}
          value={savebarInput.value}
          onChange={savebarInput.handleOnChange}
          onKeyDown={(e) =>
            e.key === "Enter" ? addCard(savebarInput, data, setData) : null
          }
          onClick={() => addCard(savebarInput, data, setData)}
        />
        <Settings
          state={[data, setData]}
          settings={[settingsIsOpen, setSettingsIsOpen]}
          title={[nameboard,setNameboard]}
        />
      </Wrapper>
    </div>
  );
};

export default Navbar;
