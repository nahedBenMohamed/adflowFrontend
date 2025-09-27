import { useContext, useMemo } from 'react';
import { GanttContext, type GanttContextValue } from './GanttContext';

export const useGanttContext = (): GanttContextValue => {
  const value = useContext(GanttContext);

  if (!value)
    throw new Error('useGanttContext must be used within a GanttContext.Provider component');

  return useMemo(() => value, [value]);
};
