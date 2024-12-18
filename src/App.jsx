import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// PAGES import
import Mainpage from "@pages/Mainpage";
import Imagespage from "@pages/Imagespage";
import Videospage from "@pages/Videospages";
import Create from "@pages/Create";
import Testing from "@pages/Testing";
import Save from "@pages/grabber/Save";

// LAYOUT import
import Navbar from "@layout/Navbar";
import Header from "@layout/Header";
import TabCards from "@layout/TabCards";

// OTHERS import
import DataContext from "@context/DataContext";
import {
  addDataLocalStorage,
  showDataLocalStorage,
  addTitleLocalStorage,
  showTitleLocalStorage,
} from "@database/localstorage";
import ModalPreview from "@components/modal/ModalPreview";
import { useLocation } from "react-router-dom";

function App() {
  const [data, setData] = useState(showDataLocalStorage());
  const [nameboard, setNameboard] = useState(showTitleLocalStorage());
  const [selectedCardOptions, setSelectedCardOptions] = useState(["Frame"]);
  const [inputRange, setInputRange] = useState(3);
  const [selectedData, setSelectedData] = useState([]);
  const [modalPreviewShow, setModalPreviewShow] = useState(false);
  useEffect(() => {
    addDataLocalStorage(data);
    addTitleLocalStorage(nameboard);
    console.log(data)
  }, [data, nameboard]);
  useEffect(() => {
    if (selectedData.length !== 0) {
      setModalPreviewShow(true);
    } else {
      setModalPreviewShow(false);
    }
  }, [selectedData]);
  let uniqueLocation = ["/save", "/create"];
  let location = useLocation().pathname;
  return (
    <>
      <DataContext.Provider
        value={{
          title: [nameboard, setNameboard],
          data: [data, setData],
          selectedCardOptions: [selectedCardOptions, setSelectedCardOptions],
          inputRange: [inputRange, setInputRange],
          selectedData: [selectedData, setSelectedData],
        }}
      >
        {modalPreviewShow && (
          <ModalPreview
            selectedData={selectedData}
            setModalPreviewShow={setModalPreviewShow}
          />
        )}
        {!uniqueLocation.includes(location) && <Navbar />}
        {!uniqueLocation.includes(location) && <Header />}
        {!uniqueLocation.includes(location) && <TabCards />}
        <Routes>
          <Route path="/" index element={<Mainpage />} />
          <Route path="/images" element={<Imagespage />} />
          <Route path="/videos" element={<Videospage />} />
          <Route path="/save" element={<Save />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/create" element={<Create />} />
        </Routes>
        {!data.length && !uniqueLocation.includes(location) ? (
          <h1 className="text-center text-[1em] opacity-50 py-[200px] ">
            NO IDEAS
          </h1>
        ) : null}
      </DataContext.Provider>
    </>
  );
}

export default App;
