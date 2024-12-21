import { useEffect, useState, useRef } from "react";
import { BsGear } from "react-icons/bs";
import Modal from "../modal/Modal";

import { useClickOutside } from "@hooks/useClickOutside";

import {
  settingsNewData,
  settingsOpenData,
  settingsSaveData,
} from "@utils/settings";
import SettingsMenu from "./SettingsMenu";
export default function Settings({ state, settings, title }) {
  const [data, setData] = state;
  const [nameboard, setNameboard] = title;
  const [settingsIsOpen, setSettingsIsOpen] = settings;
  const [newIsOpen, setNewIsOpen] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const file = useRef();
  useEffect(() => {
    setSettingsIsOpen(false);
  }, [data]);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setSettingsIsOpen(false));

  return (
    <div>
      {newIsOpen && (
        <Modal
          title="Are you sure?"
          message="This action will remove all existing data."
          confirmText="Confirm"
          cancelText="Cancel"
          confirm={() => {
            settingsNewData(setData, setNameboard);
            setNewIsOpen(false);
            window.location.reload();
          }}
          cancel={() => setNewIsOpen(false)}
        />
      )}
      {openShow && (
        <Modal
          title="Open New Data"
          message="This action will delete the current data and load new data"
          confirmText="Open"
          cancelText="Cancel"
          confirm={() => {
            file.current.click();
            setOpenShow(false);
          }}
          cancel={() => setOpenShow(false)}
        />
      )}
      <div ref={menuRef}>
        <BsGear
          className="text-[1.2em] cursor-pointer"
          onClick={() => setSettingsIsOpen(!settingsIsOpen)}
        />
        {settingsIsOpen && (
          <SettingsMenu
            newIsOpen={newIsOpen} //TOGGLE MODAL
            setNewIsOpen={setNewIsOpen} //CHANGING TOGGLE
            file={file} // FILE FOR SAVE and EXPORT
            settingsOpenData={settingsOpenData} //TOGGLE MODAL
            setData={setData} //Set DATA
            openShow={openShow} // TOGGLE MODAL
            setOpenShow={setOpenShow} // CHANGING TOGGLE
            settingsSaveData={settingsSaveData} //SAVE DATA
            setNameboard={setNameboard} // SET TITLE
          />
        )}
      </div>
    </div>
  );
}
