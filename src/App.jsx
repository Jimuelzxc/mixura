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
import {
  addDataLocalStorage,
  showDataLocalStorage,
} from "@database/localstorage";

function App() {
  const [data, setData] = useState(showDataLocalStorage());
  useEffect(() => {
    addDataLocalStorage(data);
  }, [data]);
  return (
    <ParentContainer>
      <DataContext.Provider value={[data, setData]}>
        {location.pathname !== "/save" && <Navbar />}
        {/*location.pathname !== "/save" && <Header>Moodboard</Header>*/}
        <Routes>
          <Route path="/" index element={<Mainpage />} />
          <Route path="/images" element={<Imagespage />} />
          <Route path="/videos" element={<Videospage />} />
          <Route path="/save" element={<Save />} />
        </Routes>
      </DataContext.Provider>
    </ParentContainer>
  );
}

export default App;
