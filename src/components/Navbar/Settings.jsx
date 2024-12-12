import { useEffect, useState } from "react";
import { BsGear } from "react-icons/bs";
import Button from "../Button";
import SettingsItem from "./SettingsItem";
import HyperLink from "../HyperLink";
import { useRef } from "react";
import Modal from "../modal/Modal";

import {
  settingsNewData,
  settingsOpenData,
  settingsSaveData,
} from "@utils/settings";
export default function Settings({ state, settings }) {
  const [data, setData] = state;
  const [settingsIsOpen, setSettingsIsOpen] = settings;
  const [newIsOpen, setNewIsOpen] = useState(false); // NEW ITEM
  const [openShow, setOpenShow] = useState(false); //OPEN ITEM
  const file = useRef();
  useEffect(() => {
    setSettingsIsOpen(false);
  }, [data]);
  return (
    <div>
      {newIsOpen && (
        <Modal
          title="Are you sure?"
          message="This action will remove all existing data."
          confirmText="Confirm"
          cancelText="Cancel"
          confirm={() => {
            settingsNewData(setData);
            setNewIsOpen(false);
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
        <div className="absolute bg-white border flex flex-col gap-4 translate-x-[-230px] mt-5 p-5 px-8 w-[250px] rounded-md">
          <Button>+ Create Card</Button>
          <hr />
          <div className="flex flex-col gap-2">
            <span className="opacity-40">Data:</span>
            <SettingsItem onClick={() => setNewIsOpen(!newIsOpen)}>
              New
            </SettingsItem>
            <div>
              <input
                type="file"
                ref={file}
                accept=".json"
                className="hidden"
                onChange={(e) =>
                  settingsOpenData(e, setData, setSettingsIsOpen)
                }
              />
              <SettingsItem onClick={() => setOpenShow(!openShow)}>
                Open
              </SettingsItem>
            </div>
            <SettingsItem
              onClick={() => {
                settingsSaveData();
                setSettingsIsOpen(false);
              }}
            >
              Save
            </SettingsItem>
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <span className="opacity-40">Extension:</span>
            <HyperLink href="https://google.com">Mixura Grabber</HyperLink>
          </div>
        </div>
      )}
    </div>
  );
}
