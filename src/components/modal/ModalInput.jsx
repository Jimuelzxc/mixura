import Input from "@components/Input";
import Button from "@components/Button";

export default function ModalInput(props) {
  const { done, cancel, inputRef, onChange, onKeyDown, value } = props;
  return (
    <div className="bg-black/20 backdrop-blur-sm w-full h-screen fixed z-[9999] top-0 flex justify-center items-center left-0 shadow-xl">
      <div className="bg-white border border-slate-950 p-5 bg-white/95 backdrop-blur-sm rounded-md shadow-md w-[200px] md:w-[500px] flex justify-center flex-col items-center gap-3">
        <h1 className="text-[1.4em]">Name board</h1>
        <Input
          inputRef={inputRef}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
          placeholder="Eg. motion design ideas, graphic design etc.."
        />
        <div className="flex flex-row gap-2">
          <Button onClick={done}>Done</Button>
          <Button
            onClick={cancel}
            className="border-2 bg-white border-slate-950 text-slate-950"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
