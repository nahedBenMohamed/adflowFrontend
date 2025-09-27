import { generalSettingsStore } from '@/app';
import { calculateEndOfWordIdxByNumber, Hint, UtcDate } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;

  margin-left: auto;
`;

const Content = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
`;

const LocalTimeWarning = memo(() => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.local_time_warning',
  });

  const { accountSettings } = generalSettingsStore;

  if (!accountSettings || !accountSettings.timeZone) return null;

  const differenceInSeconds = UtcDate.now().getTimezoneDifference(accountSettings.timeZone);

  if (differenceInSeconds === 0) return null;

  const difference = differenceInSeconds / (60 * 60);

  const idx = calculateEndOfWordIdxByNumber(Math.abs(difference));

  return (
    <Root>
      <Content>{t(`local_correction.${idx}`, { hours: difference })}</Content>

      <Hint text={t('hint')} />
    </Root>
  );
});

LocalTimeWarning.displayName = 'LocalTimeWarning';
export { LocalTimeWarning };
