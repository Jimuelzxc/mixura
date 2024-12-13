import { useContext, useEffect, useState } from "react";
import Wrapper from "@layout/others/Wrapper";
import SaveBarInput from "@components/Navbar/SaveBarInput";
import Settings from "@components/Navbar/Settings";

import { useInput } from "@hooks/useInput";
import {
  addDataLocalStorage,
  showDataLocalStorage,
} from "@database/localstorage";
import { addCard } from "@utils/addCard";
import DataContext from "@context/DataContext";

const Navbar = () => {
  const [data, setData, nameboard, setNameboard] = useContext(DataContext);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const savebarInput = useInput();

  useEffect(() => {
    savebarInput.ref.current.focus();
    savebarInput.setValue("");
    addDataLocalStorage(data);
  }, [data]);

  return (
    <>
    <div className=" py-5 border-b border-slate-950 fixed top-0 w-full bg-white/90 backdrop-blur-sm z-[99] shadow-md ">
      <Wrapper className="flex flex-row justify-between items-center w-full">
        <h1 className="text-[1.5em] text-slate-900">Mixura <span className="text-[0.5em] absolute translate-y-[5px] ml-1 text-blue-700">test</span></h1>
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
    </>
  );
};

export default Navbar;
