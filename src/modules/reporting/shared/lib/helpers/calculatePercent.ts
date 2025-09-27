export const calculatePercent = ({
  currentValue,
  totalValue,
}: {
  currentValue: number;
  totalValue: number;
}): number => {
  const result = Math.round((currentValue / totalValue) * 100);

  if (result > 100) return 100;

  if (result < 0) return 0;

  return result;
};
