import React, { useEffect, useState } from "react";
import InputRadio from "@components/InputRadio";
import { useInputRadio } from "@hooks/useInputRadio";

function Testing() {
  const [selectedOptions, setSelectedOptions] = useState(["Frame","Title"]);
  useEffect(() => {console.log(selectedOptions)},[selectedOptions])
  const frame = useInputRadio("Frame", selectedOptions, setSelectedOptions);
  const title = useInputRadio("Title", selectedOptions, setSelectedOptions);
  const description = useInputRadio("Description", selectedOptions, setSelectedOptions);
  const hashtags = useInputRadio("Hashtags", selectedOptions, setSelectedOptions);

  return (
    <div className="h-screen w-full bg-white top-0 fixed z-[999999] flex justify-center items-center flex-col">
      <h3 className="text-[2em]">Card</h3>
      <div className="flex flex-row gap-3">
        <InputRadio
          placeholder="Frame"
          value="Frame"
          checked={frame.isCheck}
          onChange={frame.handleCheckboxChange}
        />
        <InputRadio
          placeholder="Title"
          value="Title"
          checked={title.isCheck}
          onChange={title.handleCheckboxChange}
        />
        <InputRadio
          placeholder="Description"
          value="Description"
          checked={description.isCheck}
          onChange={description.handleCheckboxChange}
        />
        <InputRadio
          placeholder="Hashtags"
          value="Hashtags"
          checked={hashtags.isCheck}
          onChange={hashtags.handleCheckboxChange}
        />
      </div>
      {/* CARDDDDDDDDDDDDDDDDDDDD */}
      <div className="">
        {selectedOptions.includes("Frame") && (
          <div className="h-[200px] w-[200px] bg-slate-200"></div>
        )}
        {selectedOptions.includes("Title") && <h1>Title</h1>}
        {selectedOptions.includes("Description") && <p>lorem ipsum</p>}
        {selectedOptions.includes("Hashtags") && (
          <div className="flex flex-row gap-1">#blabla</div>
        )}
      </div>
    </div>
  );
}

export default Testing;
