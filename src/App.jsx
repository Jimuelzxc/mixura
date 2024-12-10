import { Routes, Route } from "react-router-dom";
import "./App.css";
import Mainpage from "./pages/Mainpage";
import Imagespage from "./pages/Imagespage";
import Videospage from "./pages/Videospages";
import Navbar from "@layout/Navbar";
import Header from "@layout/Header";
import ParentContainer from "@layout/others/ParentContainer";
function App() {
  return (
    <ParentContainer>
      <Navbar />
      <Header>Moodboard</Header>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/images" element={<Imagespage />} />
        <Route path="/videos" element={<Videospage />} />
      </Routes>
    </ParentContainer>
  );
}

export default App;
