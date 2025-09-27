interface DHMS {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export const getDaysFromSeconds = (value: number): number => {
  return Math.floor(value / SECONDS_IN_DAY);
};

export const getDHMSFromSeconds = (value: number): DHMS => {
  const days = Math.floor(value / SECONDS_IN_DAY);
  const hours = Math.floor((value % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor((value % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const seconds = Math.floor(value % SECONDS_IN_MINUTE);

  return { days, hours, minutes, seconds };
};
