import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import useGetLevel from "./useGetInitialLevel";

function useGetWordsPerLevel(newLevel) {
  const debouncedLevel = useDebounce(newLevel, 400);
  const [words, setWords] = useState([]);
  const savedLevel = useGetLevel();

  const level = newLevel == null ? savedLevel : debouncedLevel;

  useEffect(() => {
    if (level) {
      // fetch words from API with newLevel || level
      setWords([]);
    }

    return () => {};
  }, [level]);

  return words;
}

export default useGetWordsPerLevel;
