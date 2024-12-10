import Hashtag from "@components/Hashtag";
export default function CardImage({value}) {
  return (
    <div id="card" className="flex flex-col gap-2 break-inside-avoid mb-10">
      <div className="rounded-md overflow-hidden">
        <img
          src={value.url}
          alt=""
        />
      </div>
      {/*<div id="card-details" className="">
        <h1 className="text-[1.4em]">Motion #1</h1>
        <p className="mb-3">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
          necessitatibus itaque provident.
        </p>
        <div id="hashtags" className="flex gap-2">
          <Hashtag to="/hashtags">#motiondesign</Hashtag>
        </div>
      </div> */}
    </div>
  );
}
