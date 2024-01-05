'use client';

import React from 'react';
import { Button } from '@mui/material';
import { usePlacementContext } from './PlacementProvider';

const SelectLevelButton = () => {
  const { level } = usePlacementContext();

  const onSelectLevel = () => {
    if (level == null) {
      return;
    }

    console.log('selected level', level);
  };

  return (
    <Button color="primary" variant="contained" disabled={level == null} onClick={onSelectLevel}>
      Choose level
    </Button>
  );
};

export default SelectLevelButton;
