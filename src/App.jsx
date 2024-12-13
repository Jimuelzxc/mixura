import { Routes, Route } from "react-router-dom";
import "./App.css";
import Mainpage from "./pages/Mainpage";
import Imagespage from "./pages/Imagespage";
import Videospage from "./pages/Videospages";
import ParentContainer from "@layout/others/ParentContainer";
import Save from "./pages/grabber/Save";
import Navbar from "@layout/Navbar";
import Header from "@layout/Header";

import { useEffect, useState } from "react";

import DataContext from "@context/DataContext";
import { showTitleLocalStorage } from "@database/localstorage";

import {
  addDataLocalStorage,
  showDataLocalStorage,
} from "@database/localstorage";
import { addTitleLocalStorage } from "./database/localstorage";
function App() {
  const [data, setData] = useState(showDataLocalStorage());
  const [nameboard, setNameboard] = useState(showTitleLocalStorage());

  useEffect(() => {
    addDataLocalStorage(data);
  }, [data]);
  useEffect(() => {
    addTitleLocalStorage(nameboard);
  }, [nameboard]);
  return (
    <ParentContainer>
      <DataContext.Provider value={[data, setData, nameboard, setNameboard]}>
        {location.pathname !== "/save" && <Navbar />}
        {location.pathname !== "/save" && <Header />}

        <Routes>
          <Route path="/" index element={<Mainpage />} />
          <Route path="/images" element={<Imagespage />} />
          <Route path="/videos" element={<Videospage />} />
          <Route path="/save" element={<Save />} />
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
