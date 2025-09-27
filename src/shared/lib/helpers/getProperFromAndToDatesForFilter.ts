import { UtcDate, type UtcDateValue } from '../models';

export const getProperFromAndToDatesForFilter = ({
  from,
  to,
}: {
  from?: UtcDateValue;
  to?: UtcDateValue;
}): {
  from: UtcDateValue;
  to: UtcDateValue;
} => {
  if (from && to && UtcDate.isEqual(from, to))
    return {
      to: from.endOfDay(),
      from: from.startOfDay(),
    };

  if (!from && to)
    return {
      from: null,
      to: to.endOfDay(),
    };

  if (from && !to)
    return {
      from: from.startOfDay(),
      to: null,
    };

  return {
    from: from ? from.startOfDay() : null,
    to: to ? to.endOfDay() : null,
  };
};
