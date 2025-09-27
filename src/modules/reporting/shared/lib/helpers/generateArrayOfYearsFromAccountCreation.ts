import { generalSettingsStore } from '@/app';

export const generateArrayOfYearsFromAccountCreation = (toYear: number): number[] => {
  const accountCreationYear = generalSettingsStore.accountCreationYear ?? toYear;

  return Array.from(
    { length: toYear - accountCreationYear + 1 },
    (_, i) => accountCreationYear + i
  );
};
