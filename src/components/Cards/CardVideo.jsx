import Hashtag from "@components/Hashtag";
export default function CardVideo() {
  return (
    <div id="card" className="flex flex-col gap-2 break-inside-avoid mb-10">
      <div className="rounded-md overflow-hidden">
        <iframe width="auto" height="100%" src="https://www.youtube.com/embed/2KhL-fwkx8s?si=lEJhWhJ-2CCARJ7C" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
