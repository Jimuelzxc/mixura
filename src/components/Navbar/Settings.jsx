import { useState } from "react";
import { BsGear } from "react-icons/bs";
import Button from "../Button";
import SettingsItem from "./SettingsItem";
import HyperLink from "../HyperLink";

export default function Settings() {
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  return (
    <div className="">
      <BsGear className="text-[1.2em] cursor-pointer" onClick={() => setSettingsIsOpen(!settingsIsOpen)}/>
      {settingsIsOpen && <div className="absolute bg-white border flex flex-col gap-4 translate-x-[-230px] mt-5 p-5 px-8 w-[250px] rounded-md">
        <Button>+ Create Card</Button>
        <hr />
        <div className="flex flex-col gap-2">
          <span className="opacity-40">Data:</span>
          <SettingsItem>New</SettingsItem>
          <SettingsItem>Open</SettingsItem>
          <SettingsItem>Export</SettingsItem>
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
