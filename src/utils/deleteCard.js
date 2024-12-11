export function deleteData(index, data, setData) {
  const cloneData = [...data];
  cloneData.splice(index, 1);
  setData(cloneData);
}
