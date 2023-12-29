import { useQuery } from '@tanstack/react-query'
import { getAssessmentLevel } from '../../api/assessmentApi'

const DEFAULT_INITIAL_LEVEL = 0

function useGetInitialLevel(): { initialLevel: number | null; requestStatus: string } {
  const queryData = useQuery<{ level: number | null }>({
    queryKey: ['getAssessmentLevel'],
    queryFn: getAssessmentLevel,
  })

  if (queryData.status !== 'success') {
    return {
      initialLevel: null,
      requestStatus: queryData.status,
    }
  }

  return {
    initialLevel: queryData.data?.level || DEFAULT_INITIAL_LEVEL,
    requestStatus: queryData.status,
  }
}

export default useGetInitialLevel
