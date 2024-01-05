'use client';

import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import styles from './placement.module.css';
import useGetInitialLevel from './useGetInitialLevel';
import Loader from '../Loader/Loader';
import useGetAmountOfLevels from './useGetAmountOfLevels';
import useGetWordsForLevel from './useGetWordsForLevel';
import { Skeleton } from '@mui/material';

const WORDS_TO_SHOW = 10;
const WORDS_TO_SHOW_ARRAY = Array.from({ length: WORDS_TO_SHOW }, (_, i) => i);

function Placement() {
  const { initialLevel, requestStatus: levelRequestStatus } = useGetInitialLevel();
  const { count: levelsCount, requestStatus: levelsCountRequestStatus } = useGetAmountOfLevels();

  const [value, setValue] = useState(initialLevel);

  const { words, requestStatus: wordsRequestStatus } = useGetWordsForLevel(value, WORDS_TO_SHOW);

  useEffect(() => {
    if (levelRequestStatus === 'success') {
      setValue(initialLevel);
    }
  }, [initialLevel, levelRequestStatus]);

  const onSelectLevel = () => {
    console.log('selected level', value);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <div className={styles.placement}>
      <div className={styles.title}>
        <Typography variant="h5">Move the slider below to change your initial level</Typography>
      </div>
      <div className={styles.currentLevel}>
        <Typography variant="h5">
          Level: {(value ?? 0) + 1}/{levelsCount}
        </Typography>
      </div>
      {initialLevel != null && levelsCount != null && (
        <Slider defaultValue={initialLevel} min={0} max={levelsCount - 1} onChange={handleChange} />
      )}
      <div className={styles.wordsTitle}>
        <Typography fontWeight={600}>Words to learn on the level:</Typography>
      </div>
      <div className={styles.wordList}>
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
                <div className={styles.skeleton}>
                  <Skeleton />
                </div>
              </React.Fragment>
            ))}
      </div>
      <Button color="primary" variant="contained" onClick={onSelectLevel}>
        Choose level
      </Button>
    </div>
  );
}

export default Placement;
