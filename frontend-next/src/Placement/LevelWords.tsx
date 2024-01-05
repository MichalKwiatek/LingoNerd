'use client';

import React from 'react';
import { usePlacementContext } from './PlacementProvider';
import styles from './placement.module.css';
import useGetWordsForLevel from './useGetWordsForLevel';
import { Skeleton, Typography } from '@mui/material';

const WORDS_TO_SHOW = 10;
const WORDS_TO_SHOW_ARRAY = Array.from({ length: WORDS_TO_SHOW }, (_, i) => i);

const LevelWords = () => {
  const { level } = usePlacementContext();
  const { words } = useGetWordsForLevel(level, WORDS_TO_SHOW);

  if (words == null) {
    <div className={styles.wordList}>
      {WORDS_TO_SHOW_ARRAY.map((_, i) => (
        <React.Fragment key={i}>
          <div className={styles.wordSkeleton}>
            <Skeleton />
          </div>
        </React.Fragment>
      ))}
    </div>;
  }

  return (
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
              <div className={styles.wordSkeleton}>
                <Skeleton />
              </div>
            </React.Fragment>
          ))}
    </div>
  );
};

export default LevelWords;
