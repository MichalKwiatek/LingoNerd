import Typography from '@mui/material/Typography';
import React from 'react';
import styles from './placement.module.css';
import ChooseLevel from './ChooseLevel';
import { getAmountOfLevels } from './placementApi';
import PlacementProvider from './PlacementProvider';
import SelectLevelButton from './SelectLevelButton';
import LevelWords from './LevelWords';

async function fetchAmountOfLevels(): Promise<number> {
  const response = await getAmountOfLevels();

  if (response.status !== 'success') {
    throw new Error('Failed to fetch data');
  }

  return response.data.count;
}

async function Placement() {
  const levelsCount = await fetchAmountOfLevels();

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
        <LevelWords />
        <SelectLevelButton />
      </div>
    </PlacementProvider>
  );
}

export default Placement;
