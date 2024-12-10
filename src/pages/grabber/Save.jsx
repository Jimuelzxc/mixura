import { useSearchParams } from "react-router-dom";
import {
  addDataLocalStorage,
  showDataLocalStorage,
} from "@database/localstorage";
import { useEffect, useState } from "react";
export default function Save() {
    const [searchParams] = useSearchParams()
    console.log(searchParams.get("image"))
  return(
    <p>{searchParams.get("image")}</p>
  )
}
