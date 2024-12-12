import Wrapper from "@layout/others/Wrapper";
export default function Title({ children }) {
  return (
    <Wrapper className="mt-[100px] mb-[20px] pt-[40px]">
      <h1 className=" text-[2em] text-center">{children}</h1>
    </Wrapper>
  );
}
