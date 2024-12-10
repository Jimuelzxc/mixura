import Hashtag from "@components/Hashtag";
export default function CardImage() {
  return (
    <div id="card" className="flex flex-col gap-2 break-inside-avoid mb-10">
      <div className="rounded-md overflow-hidden">
        <img
          src="https://i.pinimg.com/originals/1c/93/22/1c9322cb0c2b18c52c9ac4fcb7a9fdbd.gif"
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
