import { useInput } from "@hooks/useInput";
import { useEffect } from "react";

export default function InputTags({ tagsState }) {
  const inputTag = useInput();
  const [tags, setTags] = tagsState;

  useEffect(() => {
    console.log(tags);
  }, [tags]);
  const addTag = (e) => {
    if (e.key === "Enter" && inputTag.value.trim()) {
      let tag = inputTag.value.replace(/ /g, "").toLowerCase();
      setTags([...tags, tag]);
      inputTag.setValue("");
    } else if (e.key === "Backspace" && inputTag.value === "") {
      setTags(tags.slice(0, -1));
    }
  };
  const removeTag = (tag) => {
    setTags((prev) => prev.filter((value) => value !== tag))
  };
  return (
    <label className="flex flex-col gap-3">
      <span className="text-[1.1em] font-medium">Tags</span>
      <div className="p-3 px-4 w-full border-2 rounded-md border-slate-950 focus:outline-none flex flex-row gap-2 flex-wrap">
        {tags.map((tag, index) => {
          return (
            <div
              key={index}
              onClick={() => removeTag(tag)}
              className="cursor-pointer text-blue-600 hover:text-pink-600"
            >
              #{tag}
            </div>
          );
        })}
        <input
          type="text"
          className="focus:outline-none px-4"
          placeholder="add tags..."
          ref={inputTag.ref}
          value={inputTag.value}
          onChange={inputTag.handleOnChange}
          onKeyDown={addTag}
        />
      </div>
    </label>
  );
}
