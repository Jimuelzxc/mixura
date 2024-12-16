import InputCheckBox from "@components/InputCheckBox";
export default function CardsMenu(props) {
  const { inputRange, setInputRange, selectedCardOptions, handleInputRadio } = props;
  return (
    <div className="absolute bg-white/95 backdrop-blur-sm  border border-slate-950 flex flex-col gap-4 translate-x-[-230px] mt-5 p-5 px-8 w-[250px] rounded-md shadow-md z-[999]">
      <span className="opacity-40">Column: {inputRange}</span>
      <input
        type="range"
        min="1"
        max="4"
        value={inputRange}
        onChange={(e) => setInputRange(e.target.value)}
      />
      <hr />
      <span className="opacity-40">Card Display:</span>
      <InputCheckBox
        placeholder="Frame"
        value="Frame"
        checked={selectedCardOptions.includes("Frame")}
        onChange={handleInputRadio}
      />
      <InputCheckBox
        placeholder="Title"
        value="Title"
        checked={selectedCardOptions.includes("Title")}
        onChange={handleInputRadio}
      />
      <InputCheckBox
        placeholder="Description"
        value="Description"
        checked={selectedCardOptions.includes("Description")}
        onChange={handleInputRadio}
      />
      <InputCheckBox
        placeholder="Hashtags"
        value="Hashtags"
        checked={selectedCardOptions.includes("Hashtags")}
        onChange={handleInputRadio}
      />
    </div>
  );
}
