import ParentContainer from "@layout/others/ParentContainer";
import Title from "@components/Title";

import { useNavigate } from "react-router-dom";
import { BsXLg } from "react-icons/bs";
import FormCreate from "@components/Create-page/Form";
import FormCreateLayout from "@layout/Create-page/FormCreateLayout";

export default function Create() {

  const navigate = useNavigate();
  return (
    <ParentContainer className="h-screen">
      <div className="flex flex-row justify-between py-6 items-center border-b">
        <div className="flex flex-row justify-between w-full items-center px-[30px] md:px-[100px]">
          <Title text="Create card" />
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <BsXLg className="text-[1.5em]" />
          </div>
        </div>
      </div>
      <FormCreateLayout>
        <FormCreate/>
      </FormCreateLayout>
    </ParentContainer>
  );
}
