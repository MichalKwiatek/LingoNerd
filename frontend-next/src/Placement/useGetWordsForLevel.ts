import { useEffect, useState } from 'react';
import { GetWordsPerLevelResponse, getWordsPerLevel } from './placementApi';

function useGetWordsForLevel(level: number | null, numberOfWords = 10) {
  const [queryData, setQueryData] = useState<GetWordsPerLevelResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (level == null) {
        return;
      }

      const response = await getWordsPerLevel(level, numberOfWords);
      setQueryData(response);
    };

    fetchData();
  }, [level, numberOfWords]);

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
