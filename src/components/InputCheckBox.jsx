export default function InputCheckBox(props) {
  const { placeholder, value, checked, onChange } = props;
  return (
    <label className="flex flex-row gap-4">
      <input type="checkbox" value={value} checked={checked} onChange={onChange}/>
      {placeholder}
    </label>
  );
}