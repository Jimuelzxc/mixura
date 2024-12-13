import Hashtag from "../Hashtag"
export default function CardDetails() {
  return (
    <div id="card-details" className="p-6 bg-white">
      <h1 className="text-[1.4em]">Motion #1</h1>
      <p className="mb-2 leading-5 font-regular pr-3 text-[0.9em]">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
        necessitatibus itaque provident.
      </p>
      <div id="hashtags" className="flex gap-2">
        <Hashtag to="/hashtags">#motiondesign</Hashtag>
      </div>
    </div>
  );
}
