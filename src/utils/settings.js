import {
  addDataLocalStorage,
  showDataLocalStorage,
} from "@database/localstorage";
import { showTitleLocalStorage } from "@database/localstorage";

export const settingsNewData = (setData, setNameboard) => {
  setData([]);
  setNameboard("add moodboard name")
};
export const settingsOpenData = (e, setData, setNameboard) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    let fileData = JSON.parse(reader.result);
    setNameboard(fileData.title)
    setData(fileData. data)
    console.log(fileData)
  };
  reader.readAsText(file); // para siyang "cat" cmd or ico-convert niya into text.
};
export const settingsSaveData = () => {
  let data = showDataLocalStorage();
  let title = showTitleLocalStorage();
  const backup = { title: title, data: data };
  console.log(backup);
  const blob = new Blob([JSON.stringify(backup)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "test.json";
  link.click();
};
