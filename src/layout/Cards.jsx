import CardImage from "@components/Cards/CardImage";
import CardVideo from "@components/Cards/CardVideo";
export default function Cards() {
  return (
    <div id="cards" className="columns-1 lg:columns-3 md:columns-2">
      <CardImage />
      <CardVideo />      
      <CardImage />

    </div>
  );
}

