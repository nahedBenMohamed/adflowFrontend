import type { MultitextFieldValue } from '@/modules/fields';
import { type Entity, FieldType } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AppointmentEventHoverCardFormGroup } from '../AppointmentEventHoverCardFormGroup/AppointmentEventHoverCardFormGroup';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NotProvided = styled.p`
  font-style: italic;
  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  appointmentEntity: Entity;
}

const AppointmentEventHoverCardEntityBlock = observer((props: Props) => {
  const { appointmentEntity } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  const emailFieldValues = useMemo<MultitextFieldValue[]>(
    () =>
      appointmentEntity.fieldValues.filter(
        fv => fv.fieldType === FieldType.EMAIL
      ) as MultitextFieldValue[],
    [appointmentEntity.fieldValues]
  );

  const phoneFieldValues = useMemo<MultitextFieldValue[]>(
    () =>
      appointmentEntity.fieldValues.filter(
        fv => fv.fieldType === FieldType.PHONE
      ) as MultitextFieldValue[],
    [appointmentEntity.fieldValues]
  );

  if (!emailFieldValues.length && !phoneFieldValues.length) return null;

  return (
    <Root>
      {phoneFieldValues.map(fv =>
        fv.values.map((v, idx) => (
          <AppointmentEventHoverCardFormGroup key={`${fv.fieldId}-${idx}`} label={t('phone')}>
            {v.trim().length > 0 ? v : <NotProvided>{t('not_provided')}</NotProvided>}
          </AppointmentEventHoverCardFormGroup>
        ))
      )}

      {emailFieldValues.map(fv =>
        fv.values.map((v, idx) => (
          <AppointmentEventHoverCardFormGroup key={`${fv.fieldId}-${idx}`} label={t('email')}>
            {v.trim().length > 0 ? v : <NotProvided>{t('not_provided')}</NotProvided>}
          </AppointmentEventHoverCardFormGroup>
        ))
      )}
    </Root>
  );
});

AppointmentEventHoverCardEntityBlock.displayName = 'AppointmentEventHoverCardEntityBlock';
export { AppointmentEventHoverCardEntityBlock };
