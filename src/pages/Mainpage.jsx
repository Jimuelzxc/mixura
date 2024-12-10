import { Link } from "react-router-dom";

import Wrapper from "@layout/others/Wrapper";
import TabCards from "@layout/TabCards";
import Cards from "@layout/Cards";
const Mainpage = () => {
  return (
    <Wrapper className="flex flex-col gap-6">
      <TabCards />
      <Cards />
    </Wrapper>
  );
};
export default Mainpage;
