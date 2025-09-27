import { type Optional, PrimaryButton, WarningIcon } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CompletedAppointmentsCount } from '../CompletedAppointmentsCount/CompletedAppointmentsCount';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ErrorBlock = styled.div`
  display: flex;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-red-default);
`;

const WarningIconWrapper = styled.div`
  width: 20px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  saving: boolean;
  scheduleId: Optional<number>;
  entityId: number;
  countEnabled: boolean;
  error?: string;
  onCancel: () => void;
  onSave: () => void;
}

const AddAppointmentDrawerControls = memo((props: Props) => {
  const { saving, scheduleId, entityId, countEnabled, error, onCancel, onSave } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'buttons',
  });

  return (
    <Root>
      {error && (
        <ErrorBlock>
          <WarningIconWrapper>
            <WarningIcon />
          </WarningIconWrapper>

          {error}
        </ErrorBlock>
      )}

      <Content>
        <CompletedAppointmentsCount
          scheduleId={scheduleId}
          entityId={entityId}
          enabled={countEnabled}
        />

        <PrimaryButton disabled={saving} loading={saving} onClick={onSave}>
          {t('save')}
        </PrimaryButton>

        <PrimaryButton variant="empty" onClick={onCancel}>
          {t('cancel')}
        </PrimaryButton>
      </Content>
    </Root>
  );
});

AddAppointmentDrawerControls.displayName = 'AddAppointmentDrawerControls';
export { AddAppointmentDrawerControls };
