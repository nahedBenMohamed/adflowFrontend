export const checkDatesRangesOverlap = ({
  firstRangeStart,
  firstRangeEnd,
  secondRangeStart,
  secondRangeEnd,
}: {
  firstRangeStart: number;
  firstRangeEnd: number;
  secondRangeStart: number;
  secondRangeEnd: number;
}): boolean => {
  return firstRangeStart <= secondRangeEnd && secondRangeStart <= firstRangeEnd;
};
