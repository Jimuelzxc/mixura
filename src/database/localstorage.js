export function addDataFromLocalStorage(value) {
  localStorage.setItem("data", JSON.stringify(value));
}
