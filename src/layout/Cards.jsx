import CardImage from "@components/Cards/CardImage";
import CardVideo from "@components/Cards/CardVideo";
export default function Cards() {
  return (
    <div id="cards" className="columns-1 md:columns-3">
      <CardImage />
      <CardVideo />      
    </div>
  );
}

