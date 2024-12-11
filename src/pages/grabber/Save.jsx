import { useSearchParams } from "react-router-dom";

import { addData } from "@utils/addData";
import Button from "@components/Button";

export default function Save() {
  const [searchParams] = useSearchParams();
  const getUrl = searchParams.get("url");
  return (
    <>
      <p>{getUrl}</p>
      <div className="flex flex-row gap-2 justify-end px-5">
        <Button className="px-4" onClick={() => addData(getUrl)}>
          Add
        </Button>
        <Button className="px-4" onClick={() => window.close()}>Cancel</Button>
      </div>
    </>
  );
}
