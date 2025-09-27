type Precision = 2 | 3 | 4;

export const truncateNumber = ({
  num,
  precision,
}: {
  num: number;
  precision: Precision;
}): number | string => {
  const thresholds: Record<Precision, number> = {
    2: 9,
    3: 99,
    4: 999,
  };

  if (num > thresholds[precision]) return thresholds[precision] + '+';

  return num;
};
