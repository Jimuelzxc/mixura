import InputTags from "@components/Create-page/input/InputTags";
import InputLabel from "@components/Create-page/input/InputLabel";
import TextAreaLabel from "@components/Create-page/input/TextAreaLabel";
import Button from "@components/Button";
import FormLayout from "@layout/Create-page/FormLayout";
import { useState, useContext, useEffect } from "react";
import { useInput } from "@hooks/useInput";
import DataContext from "@context/DataContext";
import { useNavigate } from "react-router-dom";
import { BsImage, BsImages } from "react-icons/bs";


export default function FormCreate() {
  const url = useInput();
  const title = useInput();
  const notes = useInput();
  const [tags, setTags] = useState([]);
  const [data, setData] = useContext(DataContext).data;
  useEffect(() =>{
    url.ref.current.focus()
  },[])

  const navigate = useNavigate();
  const addDataCreateForm = () => {
    const imgExt = [".jpg", ".jpeg", ".png", ".webp", "gif"];
    let urlObj = new URL(url.value);

    if (imgExt.some((ext) => url.value.endsWith(ext))) {
      const getimgext = url.value.split(".").pop();
      setData([
        ...data,
        {
          url: url.value,
          title: title.value,
          notes: notes.value,
          tags: tags,
          type: "image",
          ext: getimgext,
        },
      ]);
      navigate("/");
    } else if (
      urlObj.hostname.includes("youtube") &&
      urlObj.searchParams.has("v")
    ) {
      setData([
        ...data,
        {
          url: url.value,
          title: title.value,
          notes: notes.value,
          tags: tags,
          type: "video",
          ext: "youtube",
        },
      ]);
      navigate("/");
    }
  };
  return (
    <>
      <div
        id="preview"
        className="bg-grey flex justify-center items-center flex-1"
      >
        {
          url.value.includes("https://") ? <img src={url.value} alt="" className="w-full rounded-md shadow-lg" />: <BsImage className="text-[2em] opacity-35" />
        }
      </div>
      <FormLayout>
        <InputLabel
          label="Url"
          placeholder="https://website.com/blabla.gif"
          inputRef={url.ref}
          onChange={url.handleOnChange}
        />
        <div className="flex flex-col gap-5">
          <InputLabel
            label="Title"
            placeholder="faux 3d"
            inputRef={title.ref}
            onChange={title.handleOnChange}
          />
          <TextAreaLabel
            label="Notes"
            placeholder="I love the gradient"
            inputRef={notes.ref}
            onChange={notes.handleOnChange}
          />
          <InputTags tagsState={[tags, setTags]} />
        </div>
        <Button className="self-end text-white" onClick={addDataCreateForm}>
          Create
        </Button>
      </FormLayout>
    </>
  );
}
