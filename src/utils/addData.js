// ADD DATABASE ONLY


import { addDataLocalStorage, showDataLocalStorage } from "@database/localstorage";

export function addData(getUrl) {
  let currentData = showDataLocalStorage();
  const imgext = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  let inputUrl = new URL(getUrl);

  if (imgext.some((ext) => getUrl.endsWith(ext))) {
    const getext = getUrl.split(".").pop();
    addDataLocalStorage([
      ...currentData,
      { url: getUrl, type: "image", ext: getext },
    ]);
  } else if (
    inputUrl.hostname.includes("youtube") &&
    inputUrl.searchParams.has("v")
  ) {
    addDataLocalStorage([
      ...currentData,
      { url: getUrl, type: "video", ext: "youtube" },
    ]);
  }
  window.close();
}
