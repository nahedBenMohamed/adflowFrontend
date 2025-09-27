export const convertPercentToAngle = ({
  percent,
  totalDegrees,
}: {
  percent: number;
  totalDegrees: number;
}): number => {
  return Math.round((totalDegrees / 100) * percent);
};
