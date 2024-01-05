'use client';

import { setStateType } from '@/app/types';
import { createContext, useContext, useState } from 'react';
import useGetInitialLevel from './useGetInitialLevel';

type Level = number;

export const PlacementContext = createContext<
  | null
  | {
      initialLevel: Level;
      level: Level;
      setLevel: setStateType<Level | null>;
      requestStatus: 'success';
    }
  | {
      initialLevel: null;
      level: null;
      setLevel: setStateType<Level | null>;
      requestStatus: 'loading' | 'error';
    }
>(null);

interface Props {
  children: React.ReactNode;
}

export default function PlacementProvider({ children }: Props) {
  const { initialLevel, requestStatus } = useGetInitialLevel();
  const [level, setLevel] = useState<Level | null>(initialLevel);

  const value =
    requestStatus === 'success'
      ? { initialLevel, level: level ?? initialLevel, requestStatus, setLevel }
      : { initialLevel: null, level: null, requestStatus, setLevel };

  return <PlacementContext.Provider value={value}>{children}</PlacementContext.Provider>;
}

export const usePlacementContext = () => {
  const context = useContext(PlacementContext);
  if (context == null) {
    throw new Error('usePlacementContext must be used within a PlacementProvider');
  }

  return context;
};
