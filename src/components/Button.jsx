export default function Button(props) {
  const { children, onClick, className="text-white" } = props;
  return (
    <button className={`bg-slate-900 p-2 px-10 rounded-md hover:scale-[1.04] ease-in-out duration-100 ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
