import {
  CalendarPeriodControl,
  CalendarPeriodControlTitle,
  MiniLoader,
  MyDatePickerDropdown,
  PageSecondaryHeader,
  type MyDatePickerProps,
  type UtcDate,
  type UtcDateValue,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react';
import styled from 'styled-components';
import {
  LocalTimeWarning,
  SchedulerSearchBlock,
  type SchedulerSearchBlockProps,
} from '../../../../shared';

const RightControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  margin-left: auto;
`;

interface Props {
  startDate: UtcDate;
  searchProps: SchedulerSearchBlockProps;
  loadingOrRefetching: boolean;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  handleChangePeriod: (period: UtcDateValue) => void;
}

const SchedulerBoardSecondaryHeader = (props: Props) => {
  const {
    startDate,
    searchProps,
    loadingOrRefetching,
    onPrevPeriod,
    onNextPeriod,
    handleChangePeriod,
  } = props;

  const [active, { open, close }] = useDisclosure(false);

  const dateProps = useMemo<MyDatePickerProps>(
    () => ({
      value: startDate,
      onChange: handleChangePeriod,
    }),
    [startDate, handleChangePeriod]
  );

  return (
    <PageSecondaryHeader pageHasSubheader>
      <CalendarPeriodControl onPrev={onPrevPeriod} onNext={onNextPeriod}>
        <MyDatePickerDropdown
          withinPortal
          type="default"
          opened={active}
          dateProps={dateProps}
          Button={
            <CalendarPeriodControlTitle as="button" $active={active} $clickable>
              {startDate.format('MMMM, DD')}
            </CalendarPeriodControlTitle>
          }
          show={open}
          hide={close}
        />
      </CalendarPeriodControl>

      <SchedulerSearchBlock {...searchProps} />

      <RightControlsWrapper>
        {loadingOrRefetching && <MiniLoader color="var(--primary-statuses-green-520)" />}

        <LocalTimeWarning />
      </RightControlsWrapper>
    </PageSecondaryHeader>
  );
};

export { SchedulerBoardSecondaryHeader };
