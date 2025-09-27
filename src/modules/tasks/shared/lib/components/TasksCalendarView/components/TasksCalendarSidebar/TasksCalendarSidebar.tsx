import { generalSettingsStore, userStore } from '@/app';
import {
  CalendarView,
  FilterControls,
  HideScrollbarMixin,
  MenuButton,
  MyDatePicker,
  MyMultiselectColored,
  MySelect,
  UsersMultiselect,
  UtcDate,
  debounce,
  renderTodayWithIndicator,
  throttle,
  type Option,
  type UtcDateValue,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { calendarViewStore } from '../../../../../../store';
import { TaskColorType, TaskDeadlineType, type TaskCalendarFilterForm } from '../../../../models';
import { TaskEntitiesSearchBlock } from '../../../TasksFilterButton/components';
import { TasksCalendarViewSelect } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background: var(--primary-statuses-white-0);
  border-right: 1px solid var(--graphite-graphite-120);
`;

const Content = styled.div<{ $minimized?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  padding: 16px 24px;

  ${p => p.$minimized && `padding: 16px 8px`};
`;

const TopMenuWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const TodayButton = styled.button<{ $hidden?: boolean }>`
  height: 28px;
  width: 100%;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 4px 12px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--graphite-graphite-40);
    border: var(--graphite-graphite-40);
  }

  &:active {
    background: var(--graphite-graphite-80);
    border: var(--graphite-graphite-80);
  }

  ${p => p.$hidden && `display: none`};
`;

const BottomControlsWrapper = styled.div`
  width: 100%;

  padding: 11px 4px 12px 12px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const SelectsWrapper = styled.div`
  width: 260px;
  /* 394px – calendar, today button and gaps height */
  max-height: calc(100dvh - var(--header-with-subheader-height) - 394px);

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 24px 8px 0 8px;
  overflow: auto;
  transition: var(--transition-200);

  ${HideScrollbarMixin};
`;

const StageSelectWrapper = styled.div`
  display: block;
`;

interface Props {
  date: UtcDate;
  isMinimized: boolean;
  stagesOptions: Option<number>[];
  filterForm: TaskCalendarFilterForm;
  setStage: () => void;
  setLinkedCards: () => void;
  toggleMinimized: () => void;
  handleClearFilter: () => void;
  onChangeDate: (date: UtcDateValue) => void;
  selectUsers: (userIds: number[]) => void;
  toggleSaveFilterSettings: () => void;
  setTaskDeadlineType: (type: TaskDeadlineType) => void;
  setColorType: (color: TaskColorType) => void;
  handleChangeCalendarView: (view: CalendarView) => void;
}

const TasksCalendarSidebar = observer((props: Props) => {
  const {
    date,
    isMinimized,
    filterForm,
    stagesOptions,
    setStage,
    setLinkedCards,
    toggleMinimized,
    onChangeDate,
    selectUsers,
    handleClearFilter,
    toggleSaveFilterSettings,
    setTaskDeadlineType,
    setColorType,
    handleChangeCalendarView,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'calendar',
  });

  const taskTypes = useMemo<Option<TaskDeadlineType>[]>(
    () =>
      Object.values(TaskDeadlineType).map(v => ({
        value: v,
        label: t(String(v)),
      })),
    [t]
  );

  const colorTypes = useMemo<Option<TaskColorType>[]>(
    () =>
      Object.values(TaskColorType).map(v => ({
        value: v,
        label: t(String(v)),
      })),
    [t]
  );

  const handleClearEntitiesInfos = useCallback(() => (filterForm.entityInfos = []), [filterForm]);

  const { activeUsers } = userStore;
  const { showWeekend } = calendarViewStore;

  const excludeWeekendDays = useCallback(
    (date: Date) => {
      if (!showWeekend && generalSettingsStore.nonWorkingDaysAsNumberArray) {
        return generalSettingsStore.nonWorkingDaysAsNumberArray.includes(date.getDay());
      } else {
        return false;
      }
    },
    [showWeekend]
  );

  const handleClickToday = useCallback(() => onChangeDate(UtcDate.now()), [onChangeDate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetLinkedCards = useCallback(debounce(setLinkedCards, 750), [setLinkedCards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetStage = useCallback(debounce(setStage, 750), [setStage]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledClearFilter = useCallback(throttle(handleClearFilter, 750), [handleClearFilter]);

  return (
    <Root>
      <Content $minimized={isMinimized}>
        <TopMenuWrapper>
          <MenuButton sidebarShown={!isMinimized} onClick={toggleMinimized} />

          <TodayButton type="button" $hidden={isMinimized} onClick={handleClickToday}>
            {t('today')}
          </TodayButton>
        </TopMenuWrapper>

        {!isMinimized && (
          <MyDatePicker
            value={date}
            renderDay={renderTodayWithIndicator}
            excludeDate={excludeWeekendDays}
            onChange={onChangeDate}
          />
        )}

        {!isMinimized && (
          <SelectsWrapper>
            <TasksCalendarViewSelect
              viewModel={filterForm.viewSelectModel}
              handleChangeView={handleChangeCalendarView}
            />

            <UsersMultiselect
              variant="outlined"
              users={activeUsers}
              placeholder={t('users')}
              model={filterForm.usersSelectModel}
              handleChange={selectUsers}
            />

            <MySelect
              variant="outlined"
              options={taskTypes}
              model={filterForm.taskTypeSelectModel}
              handleChange={setTaskDeadlineType}
            />

            {filterForm.viewSelectModel.value !== CalendarView.AGENDA && (
              <MySelect
                variant="outlined"
                options={colorTypes}
                model={filterForm.colorSelectModel}
                handleChange={setColorType}
              />
            )}

            <TaskEntitiesSearchBlock
              minifiedView
              entitiesInfosModel={filterForm.entityInfos}
              handleApply={debouncedSetLinkedCards}
              clearEntitiesInfos={handleClearEntitiesInfos}
            />

            {stagesOptions.length > 0 && (
              <StageSelectWrapper>
                <MyMultiselectColored
                  withinPortal
                  options={stagesOptions}
                  model={filterForm.stageIds}
                  placeholder={t('stage_select')}
                  handleChange={debouncedSetStage}
                />
              </StageSelectWrapper>
            )}
          </SelectsWrapper>
        )}
      </Content>

      {!isMinimized && (
        <BottomControlsWrapper>
          <FilterControls
            saveFilterSettings={filterForm.saveFilterSettings}
            filterClearing={false}
            hasError={false}
            handleToggleSaveFilterSettings={toggleSaveFilterSettings}
            onClear={throttledClearFilter}
          />
        </BottomControlsWrapper>
      )}
    </Root>
  );
});

TasksCalendarSidebar.displayName = 'TasksCalendarSidebar';
export { TasksCalendarSidebar };
