import Navbar from "@layout/Navbar"
import Header from "@layout/Header"

import Wrapper from "@layout/others/Wrapper";
import TabCards from "@layout/TabCards";
import Cards from "@layout/Cards";
import { useContext, useEffect, useState } from "react";
import DataContext from "../context/datacontext";

const Mainpage = () => {
  const [data, setData] = useContext(DataContext);
  useEffect(() => {
    console.log({ "mainpage.jsx": data });
  }, [data]);
  return (
    <>
      <Navbar />
      <Header>Moodboard</Header>
      <Wrapper className="flex flex-col gap-6">
        <TabCards />
        <Cards />
      </Wrapper>
    </>
  );
};
export default Mainpage;
