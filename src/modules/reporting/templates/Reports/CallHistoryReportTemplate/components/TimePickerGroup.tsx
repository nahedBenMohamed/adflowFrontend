import {
  CallHistoryTimePicker,
  Delimiter,
  type DurationFilterSelectModel,
} from '@/modules/reporting/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div<{ $enabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  color: ${p =>
    p.$enabled
      ? `var(--button-text-graphite-priory-text)`
      : `var(--button-text-graphite-secondary-text)`};

  transition: var(--transition-200);
`;

const TimePickerLabel = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  padding-right: 4px;
`;

interface Props {
  model: DurationFilterSelectModel;
  handleApplyFilter: (...args: any[]) => void;
}

const TimePickerGroup = observer((props: Props) => {
  const { model, handleApplyFilter } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.calls_report_template',
  });

  const [enabled, setEnabled] = useState(false);

  const minValue = model.min.value;
  const maxValue = model.max.value;

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    Number(minValue) > 0 || Number(maxValue) > 0 ? setEnabled(true) : setEnabled(false);
  }, [minValue, maxValue]);

  return (
    <Root $enabled={enabled}>
      <TimePickerLabel>{t('placeholders.duration')}:</TimePickerLabel>

      <CallHistoryTimePicker
        model={model.min}
        handleApply={handleApplyFilter}
        setEnabled={setEnabled}
      />

      <Delimiter>-</Delimiter>

      <CallHistoryTimePicker
        model={model.max}
        handleApply={handleApplyFilter}
        setEnabled={setEnabled}
      />
    </Root>
  );
});

TimePickerGroup.displayName = 'TimePickerGroup';
export { TimePickerGroup };
