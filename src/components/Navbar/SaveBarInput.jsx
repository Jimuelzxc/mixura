import { BsArrowRightShort } from "react-icons/bs";
const SaveBarInput = (props) => {
  const { inputRef, value, onChange, onKeyDown, onClick } = props;
  return (
    <div className="flex justify-center grow">
      <div className="flex flex-row w-[60%] border-2 border-slate-900 text-slate-900 rounded-full px-3 py-[5px] text-[1.1em]">
        <input
          type="text"
          id="savebar"
          className="grow flex flex-row p-1 px-5 bg-transparent focus:outline-none "
          placeholder="https://"
          ref={inputRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <div className="flex items-center bg-slate-900 text-white px-1 rounded-full cursor-pointer" onClick={onClick}>
          <BsArrowRightShort className="text-[1.5em]" fill="white" />
        </div>
      </div>
    </div>
  );
};
export default SaveBarInput;
