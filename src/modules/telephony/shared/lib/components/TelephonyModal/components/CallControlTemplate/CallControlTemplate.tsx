import { TruncateMixin, type EntityInfo, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useGetVoximplantSIPRegistrationByExternalId } from '../../../../../../api';
import { formatCallTime, formatTelephonyPhoneNumber } from '../../../../helpers';
import { usePhoneCallTimer } from '../../../../hooks';
import {
  CreateEntityBlock,
  EllipsisAnimationBlock,
  EntitiesLinksBlock,
  PhoneNumberTitle,
} from './components';

const Root = styled.div<{ $folded: boolean }>`
  width: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${p => (p.$folded ? '12px' : '32px')};

  padding: ${p => (p.$folded ? '8px 12px 16px' : '32px')};
  transition: var(--transition-200);

  ${TruncateMixin}
`;

const MainInfoBlock = styled.div`
  width: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;

  ${TruncateMixin}
`;

const Timer = styled.span<{ $folded: boolean }>`
  font-weight: 400;
  transition: var(--transition-200);

  ${p =>
    p.$folded
      ? css`
          font-size: 14px;
          line-height: 20px;
          color: var(--primary-statuses-white-0);
        `
      : css`
          font-size: 18px;
          line-height: 25px;
          color: var(--button-text-graphite-primary-text);
        `}
`;

const Tone = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const CallFromAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

const ControlsBlock = styled.div<{ $folded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: ${p => (p.$folded ? '24px' : '16px')};

  transition: var(--transition-200);

  ${p =>
    !p.$folded &&
    css`
      padding-top: 24px;
      border-top: 1px solid var(--graphite-graphite-80);
    `}
`;

interface Props {
  folded: boolean;
  connected: boolean;
  phoneNumber: string;
  Controls: ReactNode;
  connectingText: string;
  callFromNumber: Nullable<string>;
  entityInfo: Nullable<EntityInfo>;
  callFromSipRegExternalId: Nullable<number>;
  linkedEntityInfo: Nullable<EntityInfo>;
  tone?: string;
  fold: () => void;
}

const CallControlTemplate = observer((props: Props) => {
  const {
    folded,
    Controls,
    connected,
    entityInfo,
    phoneNumber,
    connectingText,
    callFromNumber,
    linkedEntityInfo,
    callFromSipRegExternalId,
    tone,
    fold,
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.call_control_template',
  });

  const { data: voximplantSipRegistration } =
    useGetVoximplantSIPRegistrationByExternalId(callFromSipRegExternalId);

  const timer = usePhoneCallTimer(connected);

  const formattedTimer = useMemo<string>(() => formatCallTime(timer), [timer]);
  const formattedPhoneNumber = useMemo<string>(
    () => formatTelephonyPhoneNumber(phoneNumber),
    [phoneNumber]
  );

  return (
    <Root $folded={folded}>
      <MainInfoBlock>
        {!folded && (
          <>
            {callFromNumber && (
              <CallFromAnnotation>{t('call_from', { number: callFromNumber })}</CallFromAnnotation>
            )}

            {voximplantSipRegistration && (
              <CallFromAnnotation>
                {t('call_from', {
                  number: voximplantSipRegistration.registration?.sipUsername || 'Unknown SIP 👤',
                })}
              </CallFromAnnotation>
            )}
          </>
        )}

        {!folded && !entityInfo && <PhoneNumberTitle>{formattedPhoneNumber}</PhoneNumberTitle>}

        {!folded && (
          <EntitiesLinksBlock
            entityInfo={entityInfo}
            linkedEntityInfo={linkedEntityInfo}
            fold={fold}
          />
        )}

        <Timer $folded={folded}>
          {connected ? (
            formattedTimer
          ) : (
            <EllipsisAnimationBlock folded={folded} title={connectingText} />
          )}
        </Timer>

        {/* slice(-20) – to show last 20 chars */}
        {!folded && tone && tone.length > 0 && <Tone title={tone}>{tone.slice(-20)}</Tone>}

        {connected && !folded && !entityInfo && (
          <CreateEntityBlock phoneNumber={formattedPhoneNumber} />
        )}
      </MainInfoBlock>

      <ControlsBlock $folded={folded}>{Controls}</ControlsBlock>
    </Root>
  );
});

CallControlTemplate.displayName = 'CallControlTemplate';
export { CallControlTemplate };
