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
import Modal from "@components/modal/Modal";

const Navbar = () => {
  const [data, setData] = useContext(DataContext);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [newIsOpen, setNewIsOpen] = useState(false);
  const savebarInput = useInput();

  useEffect(() => {
    savebarInput.ref.current.focus();
    savebarInput.setValue("");
    addDataLocalStorage(data);
  }, [data]);

  return (
    <div className=" py-4 border-b fixed top-0 w-full bg-white z-[99]">
      <Wrapper className="flex flex-row justify-between items-center w-full">
        <h1 className="text-[1.5em] text-slate-900">Mixura.</h1>
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
        />
      </Wrapper>
    </div>
  );
};

export default Navbar;
