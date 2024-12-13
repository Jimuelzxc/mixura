export default function Input(props) {
  const { placeholder, onChange, onKeyDown, className, inputRef, value } = props;
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`p-3 px-6 w-full border-2 rounded-md border-slate-950 focus:outline-none ${className}`}
      onChange={onChange}
      onKeyDown={onKeyDown}
      ref={inputRef}
      value={value}
    />
  );
}
