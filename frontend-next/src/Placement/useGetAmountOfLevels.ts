import { useEffect, useState } from 'react';
import { GetAmountOfLevelsResponse, getAmountOfLevels } from './placementApi';

function useGetAmountOfLevels() {
  const [queryData, setQueryData] = useState<GetAmountOfLevelsResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAmountOfLevels();
      setQueryData(response);
    };

    fetchData();
  }, []);

  if (queryData?.status !== 'success') {
    return {
      count: null,
      requestStatus: queryData?.status ?? 'loading',
    };
  }

  return {
    count: queryData.data?.count,
    requestStatus: queryData.status,
  };
}

export default useGetAmountOfLevels;
