import Typography from '@mui/material/Typography';
import React from 'react';
import styles from './placement.module.css';
import ChooseLevel from './ChooseLevel';
import { getAmountOfLevels } from './placementApi';
import PlacementProvider from './PlacementProvider';
import SelectLevelButton from './SelectLevelButton';

const WORDS_TO_SHOW = 10;
const WORDS_TO_SHOW_ARRAY = Array.from({ length: WORDS_TO_SHOW }, (_, i) => i);

async function fetchAmountOfLevels(): Promise<number> {
  const response = await getAmountOfLevels();

  if (response.status !== 'success') {
    throw new Error('Failed to fetch data');
  }

  return response.data.count;
}

async function Placement() {
  const levelsCount = await fetchAmountOfLevels();

  // const { words, requestStatus: wordsRequestStatus } = useGetWordsForLevel(value, WORDS_TO_SHOW);

  return (
    <PlacementProvider>
      <div className={styles.placement}>
        <div className={styles.title}>
          <Typography variant="h5">Move the slider below to change your initial level</Typography>
        </div>
        <ChooseLevel levelsCount={levelsCount} />
        <div className={styles.wordsTitle}>
          <Typography fontWeight={600}>Words to learn on the level:</Typography>
        </div>
        {/* <div className={styles.wordList}>
        {words
          ? words.map((word) => (
              <React.Fragment key={word.id}>
                <Typography className={styles.word}>
                  {word.lemma} - {word.translation}
                </Typography>
              </React.Fragment>
            ))
          : WORDS_TO_SHOW_ARRAY.map((_, i) => (
              <React.Fragment key={i}>
                <div className={styles.wordSkeleton}>
                  <Skeleton />
                </div>
              </React.Fragment>
            ))}
      </div> */}
        <SelectLevelButton />
      </div>
    </PlacementProvider>
  );
}

export default Placement;
