import {
  MyInput,
  MyRadio,
  MySelect,
  type Option,
  SpanWithEllipsis,
  TruncateMixin,
  WeekIntervalsInput,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { type CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BuilderStepItemLabel, SchedulerIntervalSource } from '../../../../../../shared';
import type { SchedulerBuilderStore } from '../../../../../../store';
import { ContentWrapper } from '../ContentWrapper/ContentWrapper';
import { FormItemWrapper } from '../FormItemWrapper/FormItemWrapper';
import { RowWrapper } from '../RowWrapper/RowWrapper';

interface SelectWrapperProps {
  $alignItems?: CSSProperties['alignItems'];
  $paddingTop?: CSSProperties['paddingTop'];
}

const SelectWrapper = styled.div<SelectWrapperProps>`
  display: grid;
  align-items: ${p => p.$alignItems ?? 'center'};
  grid-template-columns: 60% 1fr;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${p => p.$paddingTop && `padding-top: ${p.$paddingTop}`};

  ${TruncateMixin}
`;

const RadioGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  sectionBuilderStore: SchedulerBuilderStore;
}

const SchedulerBuilderStep1BottomBlock = observer((props: Props) => {
  const { sectionBuilderStore } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.scheduler_builder_page.scheduler_builder_step1',
  });

  const durationOptions = useMemo<Option[]>(
    () => [
      {
        value: 0,
        label: t('no_duration'),
      },
      {
        value: 300,
        label: `5 ${t('minutes')}`,
      },
      {
        value: 420,
        label: `7 ${t('minutes')}`,
      },
      {
        value: 600,
        label: `10 ${t('minutes')}`,
      },
      {
        value: 900,
        label: `15 ${t('minutes')}`,
      },
    ],
    [t]
  );

  return (
    <ContentWrapper>
      <BuilderStepItemLabel label={t('schedule_params_title')} hint={t('schedule_params_hint')} />

      <RowWrapper>
        <FormItemWrapper>
          <SelectWrapper>
            <SpanWithEllipsis text={t('enter_the_interval')} />

            <MySelect
              withinPortal
              titleMinWidth={0}
              model={sectionBuilderStore.formData.timePeriod}
              options={sectionBuilderStore.formData.timePeriodOptions}
              placeholder={t('placeholders.interval')}
              variant="outlined-without-active-shadow"
            />
          </SelectWrapper>

          <SelectWrapper>
            <SpanWithEllipsis text={t('maximum_number_of_records')} />

            <MyInput
              variant="outlined"
              model={sectionBuilderStore.formData.appointmentLimit}
              placeholder={t('placeholders.unlimited')}
            />
          </SelectWrapper>

          <SelectWrapper>
            <SpanWithEllipsis text={t('time_buffer_before')} />

            <MySelect
              variant="outlined"
              titleMinWidth={0}
              options={durationOptions}
              model={sectionBuilderStore.formData.timeBufferBefore}
            />
          </SelectWrapper>

          <SelectWrapper>
            <SpanWithEllipsis text={t('time_buffer_after')} />

            <MySelect
              variant="outlined"
              titleMinWidth={0}
              options={durationOptions}
              model={sectionBuilderStore.formData.timeBufferAfter}
            />
          </SelectWrapper>

          <SelectWrapper $alignItems="start" $paddingTop="6px">
            <SpanWithEllipsis text={t('intervals_source')} />

            <RadioGroupWrapper>
              <RadioWrapper>
                <MyRadio
                  model={sectionBuilderStore.formData.intervalsSource}
                  value={SchedulerIntervalSource.SCHEDULER}
                />
                <SpanWithEllipsis text={t('scheduler_intervals')} />
              </RadioWrapper>

              <RadioWrapper>
                <MyRadio
                  model={sectionBuilderStore.formData.intervalsSource}
                  value={SchedulerIntervalSource.PERFORMERS}
                />
                <SpanWithEllipsis text={t('performers_intervals')} />
              </RadioWrapper>
            </RadioGroupWrapper>
          </SelectWrapper>
        </FormItemWrapper>

        <FormItemWrapper>
          <WeekIntervalsInput
            model={sectionBuilderStore.formData.intervals}
            disabled={
              sectionBuilderStore.formData.intervalsSource.value !==
              SchedulerIntervalSource.SCHEDULER
            }
          />
        </FormItemWrapper>
      </RowWrapper>
    </ContentWrapper>
  );
});

SchedulerBuilderStep1BottomBlock.displayName = 'SchedulerBuilderStep1BottomBlock';
export { SchedulerBuilderStep1BottomBlock };
