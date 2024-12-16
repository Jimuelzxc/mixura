import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Mainpage from "@pages/Mainpage";
import Imagespage from "@pages/Imagespage";
import Videospage from "@pages/Videospages";
import Testing from "@pages/Testing";
import Save from "@pages/grabber/Save";
import ParentContainer from "@layout/others/ParentContainer";
import Navbar from "@layout/Navbar";
import Header from "@layout/Header";
import TabCards from "@layout/TabCards";

import DataContext from "@context/DataContext";
import {
  addDataLocalStorage,
  showDataLocalStorage,
  addTitleLocalStorage,
  showTitleLocalStorage,
} from "@database/localstorage";
import ModalPreview from "@components/modal/ModalPreview";


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
  }, [data, nameboard]);
  useEffect(() => {
    if (selectedData.length !== 0) {
      setModalPreviewShow(true);
    } else {
      setModalPreviewShow(false);
    }
  }, [selectedData]);
  return (
    <ParentContainer>
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
        {location.pathname !== "/save" && <Navbar />}
        {location.pathname !== "/save" && <Header />}
        <TabCards />
        <Routes>
          <Route path="/" index element={<Mainpage />} />
          <Route path="/images" element={<Imagespage />} />
          <Route path="/videos" element={<Videospage />} />
          <Route path="/save" element={<Save />} />
          <Route path="/Testing" element={<Testing />} />
        </Routes>
        {!data.length ? (
          <h1 className="text-center text-[1em] opacity-50 py-[200px] ">
            NO IDEAS
          </h1>
        ) : null}
      </DataContext.Provider>
    </ParentContainer>
  );
}


export default App;
