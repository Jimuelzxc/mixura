import Wrapper from "@layout/others/Wrapper";
export default function Title({ children }) {
  return (
    <Wrapper className="mt-[140px] mb-[20px] pt-[40px] flex justify-center items-center">
      <h1 className=" text-[2em] text-center z-[2]">{children}</h1>
    </Wrapper>
  );
}
