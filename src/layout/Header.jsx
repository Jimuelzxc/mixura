import Wrapper from "@layout/others/Wrapper";
export default function Title({ children }) {
  return (
    <Wrapper className="mt-[120px] mb-[20px] py-[40px]">
      <h1 className=" text-[4em]">{children}</h1>
      <p className="mr-[45%]">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium quo fugit praesentium corrupti deleniti atque velit laboriosam esse ipsam iusto fugiat odit quasi temporibus, hic soluta commodi veritatis nobis sed!</p>
    </Wrapper>
  );
}
