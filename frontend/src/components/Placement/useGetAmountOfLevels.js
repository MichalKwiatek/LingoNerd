import { useQuery } from '@tanstack/react-query'
import { getAmountOfLevels } from '../../api/assessmentApi'

function useGetAmountOfLevels() {
  const queryData = useQuery({
    queryKey: ['getAmountOfLevels'],
    queryFn: getAmountOfLevels,
  })

  return {
    count: queryData.data?.count,
    requestStatus: queryData.status,
  }
}

export default useGetAmountOfLevels
