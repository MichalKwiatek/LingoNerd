export type RequestStatus = 'loading' | 'success' | 'error';
export type Response<T> =
  | {
      status: RequestStatus;
      data: T;
    }
  | {
      status: 'loading';
    };

export type GetAmountOfLevelsResponse = Response<{ count: number }>;
export const getAmountOfLevels = async (): Promise<GetAmountOfLevelsResponse> => ({
  status: 'success',
  data: { count: 1000 },
});

export type GetPlacementLevelResponse = Response<{ level: number | null }>;
export const getPlacementLevel = async (): Promise<GetPlacementLevelResponse> => ({
  status: 'success',
  data: { level: 200 },
});

export type Word = { id: string; lemma: string; translation: string };
export type GetWordsPerLevelResponse = Response<{ words: Word[] }>;
export const getWordsPerLevel = async (level: number, numberOfWords: number): Promise<GetWordsPerLevelResponse> => {
  const words = Array.from(Array(1000).keys()).map((i) => ({
    id: i.toString(),
    lemma: `lemma${i}`,
    translation: `translation${i}`,
  }));

  return {
    status: 'success',
    data: { words: words.slice(level, level + numberOfWords) },
  };
};
