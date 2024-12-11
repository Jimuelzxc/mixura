import { useEffect, useState } from "react";
import { BsGear } from "react-icons/bs";
import Button from "../Button";
import SettingsItem from "./SettingsItem";
import HyperLink from "../HyperLink";
import { useRef } from "react";

import { settingsNewData, settingsOpenData, settingsExportData } from "@utils/settings";
export default function Settings({state}) {
  const [data, setData] = state;
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const file = useRef()
  useEffect(() => {setSettingsIsOpen(false)},[data])
  return (
    <div>
      <BsGear className="text-[1.2em] cursor-pointer" onClick={() => setSettingsIsOpen(!settingsIsOpen)}/>
      {settingsIsOpen && <div className="absolute bg-white border flex flex-col gap-4 translate-x-[-230px] mt-5 p-5 px-8 w-[250px] rounded-md">
        <Button>+ Create Card</Button>
        <hr />
        <div className="flex flex-col gap-2">
          <span className="opacity-40">Data:</span>
          <SettingsItem onClick={() => settingsNewData(setData)}>New</SettingsItem>
          <div>
            <input type="file" ref={file} accept=".json" className="hidden" onChange={(e)=> settingsOpenData(e, setData, setSettingsIsOpen)}/>
            <SettingsItem onClick={()=> file.current.click()}>Open</SettingsItem>
          </div>
          <SettingsItem onClick={() => settingsExportData(setSettingsIsOpen)}>Export</SettingsItem>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <span className="opacity-40">Extension:</span>
          <HyperLink href="https://google.com">Mixura Grabber</HyperLink>
        </div>
      </div>}
    </div>
  );
}
