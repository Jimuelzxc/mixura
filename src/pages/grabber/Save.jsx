import { useSearchParams } from "react-router-dom";
import {
  addDataLocalStorage,
  showDataLocalStorage,
} from "@database/localstorage";
import { useEffect, useState } from "react";

import Button from "@components/Button";

function addData(getUrl) {
  let currentData = showDataLocalStorage();
  const imgext = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  let inputUrl = new URL(getUrl);

  if (imgext.some((ext) => getUrl.endsWith(ext))) {
    const getext = getUrl.split(".").pop();
    addDataLocalStorage([
      ...currentData,
      { url: getUrl, type: "image", ext: getext },
    ]);

    alert(getext);
  } else if (
    inputUrl.hostname.includes("youtube") &&
    inputUrl.searchParams.has("v")
  ) {
    addDataLocalStorage([
      ...currentData,
      { url: getUrl, type: "video", ext: "youtube" },
    ]);
  }else {
    alert(false)
  }
}

export default function Save() {
  const [searchParams] = useSearchParams();
  const getUrl = searchParams.get("url");
  return (
    <>
      <p>{getUrl}</p>
      <Button className="px-4 mx-auto" onClick={() => addData(getUrl)}>
        Add
      </Button>
    </>
  );
}
