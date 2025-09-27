import {
  CalendarView,
  generateSegmentedControlItems,
  MySegmentedControl,
  Nullable,
  PageSecondaryHeader,
} from '@/shared';
import { type SegmentedControlItem } from '@mantine/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CalendarPeriodControl, CalendarPeriodControlTitle } from '../../../../pages';
import {
  ProductCategoriesSelect,
  type ProductCategoriesSelectProps,
  type ResourceViewMode,
} from '../../../../shared';

const CalendarToolbarContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const CalendarToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CalendarToolbarRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

interface Props {
  title: string;
  categorySelectProps: ProductCategoriesSelectProps;
  resourceViewMode: ResourceViewMode;
  handleChangeResourceViewMode: (view: ResourceViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onChangeGridPeriod: (newPeriod: Nullable<string>) => void;
}

const SELECT_TITLE_WIDTH = '150px';

const CalendarToolbar = (props: Props) => {
  const {
    title,
    categorySelectProps,
    // resourceViewMode,
    // handleChangeResourceViewMode,
    onPrev,
    onNext,
    onChangeGridPeriod,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'calendar',
  });

  const segmentedControlItems = useMemo<SegmentedControlItem[]>(
    () =>
      generateSegmentedControlItems({
        items: [CalendarView.WEEK, CalendarView.MONTH],
        t,
      }),
    [t]
  );

  return (
    <PageSecondaryHeader pageHasSubheader>
      <CalendarToolbarContainer>
        <CalendarToolbarLeft>
          <CalendarPeriodControl onNext={onNext} onPrev={onPrev}>
            <CalendarPeriodControlTitle>{title}</CalendarPeriodControlTitle>
          </CalendarPeriodControl>

          <ProductCategoriesSelect
            clearable
            titleWidth={SELECT_TITLE_WIDTH}
            {...categorySelectProps}
          />
        </CalendarToolbarLeft>

        <CalendarToolbarRight>
          {/* Temporarily disable view switching */}

          {/* <ResourceViewSegmentedControl
            resourceViewMode={resourceViewMode}
            onChangeViewMode={handleChangeResourceViewMode}
          /> */}

          <MySegmentedControl controlItems={segmentedControlItems} onChange={onChangeGridPeriod} />
        </CalendarToolbarRight>
      </CalendarToolbarContainer>
    </PageSecondaryHeader>
  );
};

export { CalendarToolbar };
