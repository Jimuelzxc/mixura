import { BsX } from "react-icons/bs";
export default function ModalPreview({ selectedData, setModalPreviewShow }) {
  return (
    <div className="fixed h-screen w-full bg-slate-900/60 backdrop-blur-sm z-[999999999999999999] top-0 flex items-center justify-center">
      <div
        className="fixed right-0 top-0 m-12 text-[2em] cursor-pointer border border-white p-4 rounded-full opacity-55 hover:opacity-90 ease-in-out duration-150"
        onClick={() => setModalPreviewShow(false)}
      >
        <BsX className="text-[1.5em]" fill="white" />
      </div>
      <div>
        <img src={selectedData.url} alt="" />
      </div>
    </div>
  );
}
