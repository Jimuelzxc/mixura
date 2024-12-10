import { useState, useRef } from "react";
export function useInput() {
  const [value, setValue] = useState("");
  const ref = useRef();
  const handleOnChange = (e) => {
    setValue(e.target.value);
  };
  return { value, setValue, handleOnChange, ref };
}