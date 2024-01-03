import { useEffect, useState } from 'react';
import { GetPlacementLevelResponse, getPlacementLevel } from './placementApi';

const DEFAULT_INITIAL_LEVEL = 0;

function useGetAmountOfLevels() {
  const [queryData, setQueryData] = useState<GetPlacementLevelResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPlacementLevel();
      setQueryData(response);
    };

    fetchData();
  }, []);

  if (queryData?.status !== 'success') {
    return {
      initialLevel: null,
      requestStatus: queryData?.status ?? 'loading',
    };
  }

  return {
    initialLevel: queryData.data?.level ?? DEFAULT_INITIAL_LEVEL,
    requestStatus: queryData.status,
  };
}

export default useGetAmountOfLevels;
