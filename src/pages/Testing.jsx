import { useEffect, useState } from "react";
import { showDataLocalStorage } from "@database/localstorage";
import { BsX } from "react-icons/bs";
import Button from "@components/Button";

function Testing() {
  const [data, setData] = useState(showDataLocalStorage());
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelectedData] = useState([])
  useEffect(() => {console.log(selected)},[selected])
  return (
    <div
      className="h-screen w-full fixed top-0 bg-white z-[9999] flex items-center justify-center"
      onKeyDown={(e) => console.log(true)}
    >
      {showModal && <ModalPreview selected={selected} setShowModal={setShowModal} />}

      <div className="w-full columns-3 px-12 py-12">
        {data.map((item) => {
          return (
            <img
              src={item.url}
              className="mb-3 cursor-pointer"
              onClick={() => {
                setSelectedData(item)
                setShowModal(true)
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const ModalPreview = ({ selected, setShowModal }) => {
  return (
    <div className="h-full w-full absolute bg-white/95 backdrop-blur-sm flex justify-center items-center flex-col gap-3">
      <div className="fixed right-0 top-0 m-12 text-[2em] cursor-pointer border border-slate-950 p-4 rounded-full opacity-55 hover:opacity-90 ease-in-out duration-150" onClick={() => setShowModal(false)}>
        <BsX className="text-[1.5em]" />
      </div>
      <div className="columns-3 px-5">
        <div className="border border-slate-950 shadow-2xl hover:scale-[1.1] ease-[cubic-bezier(.93,-0.13,0,1.17)] duration-150">
          <img alt={selected.url} srcset="" />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Testing;
