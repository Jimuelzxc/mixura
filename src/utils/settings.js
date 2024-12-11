import { addDataLocalStorage, showDataLocalStorage } from "@database/localstorage";

export const settingsNewData = (setData) => {
    setData([])
};
export const settingsOpenData = (e,setData, setSettingsIsOpen) => {
    const file = e.target.files[0]
    const reader = new FileReader() 
    reader.onload =()=>{
        let fileData = JSON.parse(reader.result)
        setData(fileData)
    }
    reader.readAsText(file)// para siyang "cat" cmd or ico-convert niya into text.
};
export const settingsExportData = (setSettingsIsOpen) => {
    let data = showDataLocalStorage()
    const blob = new Blob([JSON.stringify(data)],{type:"application/json"})
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "test.json"
    link.click()
    setSettingsIsOpen(false)
};
