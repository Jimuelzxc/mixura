export const useInputRadio = (text, selectedOptions, setSelectedOptions) => {
  let isCheck = selectedOptions.includes(text);
  const handleCheckboxChange = (event) => {
    const value = event.target.value; // input change, targeting specific input and get the value
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };
  return { isCheck, handleCheckboxChange };
};
