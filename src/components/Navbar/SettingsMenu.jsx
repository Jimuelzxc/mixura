import Button from "../Button";
import SettingsItem from "./SettingsItem";
import HyperLink from "../HyperLink";
export default function SettingsMenu(props) {
    const {newIsOpen, setNewIsOpen, file, settingsOpenData, openShow, setOpenShow, settingsSaveData, setData, setNameboard} = props
  return (
    <div className="absolute bg-white/95 backdrop-blur-sm  border border-slate-950 flex flex-col gap-4 translate-x-[-230px] mt-5 p-5 px-8 w-[250px] rounded-md shadow-md">
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
            onChange={(e) => settingsOpenData(e, setData, setNameboard)}
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
  );
}
