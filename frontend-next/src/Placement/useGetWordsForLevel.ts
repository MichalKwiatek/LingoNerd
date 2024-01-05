import { useEffect, useState } from 'react';
import { GetWordsPerLevelResponse, getWordsPerLevel } from './placementApi';
import useDebounce from '../hooks/useDebounce';

function useGetWordsForLevel(level: number | null, numberOfWords = 10) {
  const [queryData, setQueryData] = useState<GetWordsPerLevelResponse | null>(null);

  const debouncedLevel = useDebounce(level, 200);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedLevel == null) {
        return;
      }

      const response = await getWordsPerLevel(debouncedLevel, numberOfWords);
      setQueryData(response);
    };

    fetchData();
  }, [debouncedLevel, numberOfWords]);

  if (queryData?.status !== 'success') {
    return {
      words: null,
      requestStatus: queryData?.status ?? 'loading',
    };
  }

  return {
    words: queryData.data?.words,
    requestStatus: queryData.status,
  };
}

export default useGetWordsForLevel;
