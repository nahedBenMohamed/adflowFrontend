import type { Option } from '@/shared';

export const generateRentalIntervalStartTimeOptions = (): Option<string>[] => {
  const options: Option<string>[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    options.push({ value: `${formattedHour}:00`, label: `${formattedHour}:00` });
  }

  return options;
};
