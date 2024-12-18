import Wrapper from "@layout/others/Wrapper";
export default function FormCrateLayout({ children }) {
  return (
    <Wrapper className="flex flex-col gap-5 mt-[40px]">
      <div className="flex items-center">
        <div
          id="form-preview-wrapper"
          className="flex md:flex-row flex-col w-full gap-10"
        >
          {children}
        </div>
      </div>
    </Wrapper>
  );
}
