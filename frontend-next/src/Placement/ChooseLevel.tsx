'use client';

import React from 'react';
import styles from './placement.module.css';
import { Skeleton, Slider, Typography } from '@mui/material';
import { usePlacementContext } from './PlacementProvider';

interface Props {
  levelsCount: number;
}

const ChooseLevel = ({ levelsCount }: Props) => {
  const { initialLevel, level, requestStatus, setLevel } = usePlacementContext();

  if (requestStatus !== 'success') {
    return (
      <>
        <div className={styles.currentLevel}>
          <div className={styles.currentLevelSkeleton}>
            <Skeleton sx={{ height: 32 }} />
          </div>
        </div>
        <div className={styles.sliderSkeleton}>
          <Skeleton sx={{ height: 30 }} />
        </div>
      </>
    );
  }

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setLevel(newValue as number);
  };

  return (
    <>
      <div className={styles.currentLevel}>
        <Typography variant="h5">
          Level: {level + 1}/{levelsCount}
        </Typography>
      </div>
      <Slider defaultValue={initialLevel} min={0} max={levelsCount - 1} onChange={handleChange} />
    </>
  );
};

export default ChooseLevel;
