import { formatDuration } from 'date-fns';

export const formatSeconds = (sec: number): string => {
  const seconds = Math.trunc(sec % 60);
  const minutes = Math.trunc((sec / 60) % 60);
  const hours = Math.trunc((sec / 60 / 60) % 24);
  const days = Math.trunc(sec / 60 / 60 / 24);

  return formatDuration({ days, hours, minutes, seconds });
};
