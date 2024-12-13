import { useEffect, useState } from "react";
import { BsGear } from "react-icons/bs";
import { useRef } from "react";
import Modal from "../modal/Modal";

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
  const [newIsOpen, setNewIsOpen] = useState(false); // NEW ITEM
  const [openShow, setOpenShow] = useState(false); //OPEN ITEM
  const file = useRef();
  useEffect(() => {
    setSettingsIsOpen(false);
  }, [data]);
  useEffect(() => {
    console.log(nameboard);
  }, [nameboard]);
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
          openShow={openShow}// TOGGLE MODAL
          setOpenShow={setOpenShow} // CHANGING TOGGLE
          settingsSaveData={settingsSaveData}//SAVE DATA
          setNameboard={setNameboard}// SET TITLE
        />
      )}
    </div>
  );
}
