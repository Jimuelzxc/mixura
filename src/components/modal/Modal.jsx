import Button from "@components/Button";
export default function Modal(props) {
  const { title, message, confirm, cancel, confirmText, cancelText } = props;
  return (
    <div className="bg-black/20 backdrop-blur-sm w-full h-screen fixed z-[9999] top-0 flex justify-center items-center left-0 shadow-xl">
      <div className="bg-white border border-slate-950 p-5 bg-white/95 backdrop-blur-sm rounded-md shadow-md w-[200px] md:w-[500px] flex justify-center flex-col items-center gap-3">
        <h1 className="text-[2em] mb-5">{title}</h1>
        <p className="text-center text-slate-950/70">{message}</p>
        <div className="flex gap-2 mt-3">
          <Button
            className="bg-white/0  border border-slate-950 text-slate-900"
            onClick={confirm}
          >
            {confirmText}
          </Button>
          <Button onClick={cancel} className="text-white">{cancelText}</Button>
        </div>
      </div>
    </div>
  );
}
