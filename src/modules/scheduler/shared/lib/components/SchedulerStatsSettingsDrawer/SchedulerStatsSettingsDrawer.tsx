import {
  type CheckboxModel,
  FormItem,
  FormItemLabel,
  MyCheckbox,
  MyDrawer,
  MyDrawerHeaderTitle,
  SpanWithEllipsis,
  TruncateMixin,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ScheduleAppointmentStatisticsType } from '../../models';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  overflow-x: hidden;
  padding: 16px 16px 8px;
`;

const StatsVisibilitySettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 4px));
  column-gap: 8px;
  row-gap: 12px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  opened: boolean;
  hiddenStatsTypes: CheckboxModel;
  hide: () => void;
}

const SchedulerStatsSettingsDrawer = observer((props: Props) => {
  const { opened, hiddenStatsTypes, hide } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.stats_settings_drawer',
  });

  const getToggleStatsTypeHandler = useCallback(
    (st: ScheduleAppointmentStatisticsType) => () => {
      if (hiddenStatsTypes.values.includes(st)) {
        hiddenStatsTypes.setValues(hiddenStatsTypes.values.filter(v => v !== st));
      } else {
        hiddenStatsTypes.setValues([...hiddenStatsTypes.values, st]);
      }
    },
    [hiddenStatsTypes]
  );

  return (
    <MyDrawer
      paddingBottom
      opened={opened}
      ensurePageSubheader
      Header={<MyDrawerHeaderTitle>{t('title')}</MyDrawerHeaderTitle>}
      hide={hide}
    >
      <Content>
        <FormItem gap="8px">
          <FormItemLabel $color="var(--button-text-graphite-primary-text)">
            {t('description')}
          </FormItemLabel>

          <StatsVisibilitySettingsGrid>
            {Array.from(Object.values(ScheduleAppointmentStatisticsType)).map(st => (
              <CheckboxWrapper key={st}>
                <MyCheckbox
                  checked={!hiddenStatsTypes.values.includes(st)}
                  onChange={getToggleStatsTypeHandler(st)}
                />
                <SpanWithEllipsis text={t(`stats.${st}`)} />
              </CheckboxWrapper>
            ))}
          </StatsVisibilitySettingsGrid>
        </FormItem>
      </Content>
    </MyDrawer>
  );
});

SchedulerStatsSettingsDrawer.displayName = 'SchedulerStatsSettingsDrawer';
export { SchedulerStatsSettingsDrawer };
