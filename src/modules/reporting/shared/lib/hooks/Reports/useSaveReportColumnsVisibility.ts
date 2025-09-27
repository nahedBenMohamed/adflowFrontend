import { UtcDate } from '@/shared';
import type { OnChangeFn, VisibilityState } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import type {
  CallHistoryReportFilterDto,
  ComparativeReportFilterDto,
  CustomerReportFilterDto,
  GeneralReportFilterDto,
  ProductsReportFilterDto,
  ProjectEntitiesReportFilterDto,
  ProjectTaskUserReportFilterDto,
  ScheduleReportFilterDto,
  TelephonyReportFilterDto,
} from '../../../../api';
import type {
  CallHistoryReportType,
  ComparativeReportType,
  CustomerReportType,
  GeneralReportType,
  PossibleReportType,
  ProductsReportType,
  ProjectReportType,
  ReportFilterSettings,
  ScheduleReportType,
  TelephonyReportType,
} from '../../models';

export const useSaveReportColumnsVisibility = <
  T extends PossibleReportType,
  F extends T extends GeneralReportType
    ? GeneralReportFilterDto
    : T extends ComparativeReportType
      ? ComparativeReportFilterDto
      : T extends TelephonyReportType
        ? TelephonyReportFilterDto
        : T extends CallHistoryReportType
          ? CallHistoryReportFilterDto
          : T extends ProjectReportType.PROJECT_TASK_USERS
            ? ProjectTaskUserReportFilterDto
            : T extends ProjectReportType.PROJECT_ENTITIES
              ? ProjectEntitiesReportFilterDto
              : T extends ScheduleReportType
                ? ScheduleReportFilterDto
                : T extends CustomerReportType
                  ? CustomerReportFilterDto
                  : T extends ProductsReportType
                    ? ProductsReportFilterDto
                    : never,
>({
  id,
  settings,
  reportType,
  savedFilterSettings,
  extraId,
}: {
  id: number;
  reportType: T;
  settings: {
    filters: ReportFilterSettings<T, F>[];
  };
  savedFilterSettings?: ReportFilterSettings<T, F>;
  extraId?: number | string;
}): {
  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;
} => {
  const getSavedColumnVisibility = useCallback((): VisibilityState => {
    if (!savedFilterSettings) return {};

    return savedFilterSettings.columnVisibility;
  }, [savedFilterSettings]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    getSavedColumnVisibility()
  );

  useEffect(() => {
    const saveColumnVisibility = (columnVisibility: VisibilityState) => {
      const savedFilters = settings.filters ?? [];

      if (savedFilterSettings) {
        settings.filters = savedFilters.map(s =>
          s.reportType === reportType && s.id === id && s.extraId === extraId
            ? {
                ...s,
                columnVisibility,
                updatedAt: UtcDate.nowISO(),
              }
            : s
        );
      } else {
        settings.filters = [
          ...savedFilters.filter(
            s => s.reportType !== reportType || s.id !== id || s.extraId !== extraId
          ),
          {
            id: id,
            extraId,
            reportType,
            filter: undefined,
            columnVisibility,
            updatedAt: UtcDate.nowISO(),
          },
        ];
      }
    };

    saveColumnVisibility(columnVisibility);
  }, [columnVisibility, id, reportType, savedFilterSettings, settings, extraId]);

  return {
    columnVisibility,
    setColumnVisibility,
  };
};
