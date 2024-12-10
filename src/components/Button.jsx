export default function Button(props) {
  const { children, onClick } = props;
  return (
    <button className="bg-slate-900 text-white p-2 rounded-md hover:scale-[1.04] ease-in-out duration-100" onClick={onClick}>
      {children}
    </button>
  );
}
