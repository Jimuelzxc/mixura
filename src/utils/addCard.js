// ADD DATA BOTH IN REACT AND DATABASE

export const addCard = (savebarInput, data, setData) => {
  if (!savebarInput.value.trim()) return;
  const imgext = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const inputURL = new URL(savebarInput.value);
  if (imgext.some((ext) => savebarInput.value.endsWith(ext))) {
    // IMAGE
    const getimgext = savebarInput.value.split(".").pop();
    setData([
      ...data,
      {
        url: savebarInput.value,
        title: "",
        notes: "",
        tags: ["notags"],
        type: "image",
        ext: getimgext,
      },
    ]);
  } else if (
    inputURL.hostname.includes("youtube") &&
    inputURL.searchParams.has("v")
  ) {
    // VIDEO - YOUTUBE
    setData([
      ...data,
      {
        url: savebarInput.value,
        title: "",
        notes: "",
        tags: ["notags"],
        type: "video",
        ext: "youtube",
      },
    ]);
  }
};
