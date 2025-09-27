import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const AddAppointmentDrawerHeader = memo(() => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  return <Root>{t('new_visit')}</Root>;
});

AddAppointmentDrawerHeader.displayName = 'AddAppointmentDrawerHeader';
export { AddAppointmentDrawerHeader };
