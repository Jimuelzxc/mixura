import { useEffect } from "react";

export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
