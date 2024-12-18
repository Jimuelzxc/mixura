import ParentContainer from "@layout/others/ParentContainer";
import Wrapper from "@layout/others/Wrapper";
import Title from "@components/Title";
import Button from "@components/Button";

export default function Create() {
  return (
    <ParentContainer className="h-screen">
      <Wrapper className="flex flex-col h-full">
        {/* HEADER */}
        <div className="flex flex-row justify-between py-10 border-b items-center">
          <Title text="Create card" />
          <div>Close</div>
        </div>

        {/* FORM AND PREVIEW */}
        <div className="flex flex-row h-full items-center">
          {/* Preview*/}
          <div id="form-preview-wrapper" className="flex flex-row w-full gap-10 mb-[100px]">
            <div id="preview" className="border border-slate-900 bg-grey grow"></div>
            {/* FORM*/}
            <div id="form" className="border rounded-md flex flex-col gap-14 flex-1 p-6">
              <InputLabel label="Url" placeholder="e.g (https://things.com/blabla.gif)" />
              <div className="flex flex-col gap-5">
                <InputLabel label="Title" placeholder="e.g (faux 3d)" />
                <TextAreaLabel label="Notes" placeholder="e.g (I love the gradient)" />
                <InputTags />
              </div>
              <Button className="self-end text-white">Create</Button>
            </div>
          </div>
        </div>
      </Wrapper>
    </ParentContainer>
  );
}
function InputTags() {
  return (
    <label className="flex flex-col gap-3">
      <span className="text-[1.1em] font-medium">Tags</span>
      <div className="p-3 px-6 w-full border-2 rounded-md border-slate-950 focus:outline-none flex flex-row gap-2">
        <span>#motiongraphics</span>
        <input
          type="text"
          className="focus:outline-none px-4"
          placeholder="add tags..."
        />
      </div>
    </label>
  );
}

function InputLabel(props) {
  const {
    label,
    placeholder,
    className,
    onChange,
    onKeyDown,
    inputRef,
    value,
  } = props;
  return (
    <label className="flex flex-col gap-3">
      <span className="text-[1.1em] font-medium">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className={`p-3 px-6 w-full border-2 rounded-md border-slate-950 focus:outline-none ${className}`}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
        value={value}
      />
    </label>
  );
}

function TextAreaLabel(props) {
  const {
    label,
    placeholder,
    className,
    onChange,
    onKeyDown,
    inputRef,
    value,
  } = props;
  return (
    <label className="flex flex-col gap-3">
      <span className="text-[1.1em] font-medium">{label}</span>
      <textarea
        placeholder={placeholder}
        className={`p-3 px-6 w-full border-2 rounded-md border-slate-950 focus:outline-none ${className}`}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
        value={value}
      />
    </label>
  );
}
