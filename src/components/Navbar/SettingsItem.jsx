export default function SettingsItem({children, onClick}) {
  return (
    <div className="hover:bg-slate-900 hover:text-white hover:p-2 hover:px-4 hover:rounded-md ease-in-out duration-100 cursor-pointer" onClick={onClick}>
      {children}
    </div>
  );
}
