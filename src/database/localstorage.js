export const addDataLocalStorage = (value) => {
  localStorage.setItem("data", JSON.stringify(value));
};
export const showDataLocalStorage = () => {
  let data = JSON.parse(localStorage.getItem("data"))
  return data ? data : []
};
