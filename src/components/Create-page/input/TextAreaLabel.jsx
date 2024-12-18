export default function TextAreaLabel(props) {
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

