export const addDataLocalStorage = (value) => {
  localStorage.setItem("data", JSON.stringify(value));
};
export const showDataLocalStorage = () => {
  let data = JSON.parse(localStorage.getItem("data"))
  return data ? data : []
};

export const showTitleLocalStorage = () => {  
  let data = localStorage.getItem("title")
  return data ? data : "add moodboard name"
};

export const addTitleLocalStorage = (value) => {
  localStorage.setItem("title", value)
}
