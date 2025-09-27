import {
  DatePeriodFilterType,
  EntityCreatedAtFilter,
  getProperFromAndToDatesForFilter,
  type DatePeriodFilterModel,
  type Optional,
} from '@/shared';

export const getCreatedAtFilter = (
  filterModel: DatePeriodFilterModel
): Optional<EntityCreatedAtFilter> => {
  const { from, to } = getProperFromAndToDatesForFilter({
    from: filterModel.from,
    to: filterModel.to,
  });

  if (filterModel.type === DatePeriodFilterType.PERIOD)
    return new EntityCreatedAtFilter({
      type: filterModel.type,
      to: to ? to.formatISO() : undefined,
      from: from ? from.formatISO() : undefined,
    });

  if (filterModel.type && filterModel.type !== DatePeriodFilterType.ALL)
    return new EntityCreatedAtFilter({ type: filterModel.type });

  return;
};
