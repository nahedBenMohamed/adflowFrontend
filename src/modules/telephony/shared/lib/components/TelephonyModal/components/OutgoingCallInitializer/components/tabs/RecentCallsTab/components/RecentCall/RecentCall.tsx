import { routes } from '@/app';
import { Hint, SpanWithEllipsis, TruncateMixin, type SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { CSSProperties, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { voximplantConnectorStore } from '../../../../../../../../../../../store';
import {
  RecentCallIncomingIcon,
  RecentCallOutgoingIcon,
} from '../../../../../../../../../../assets';
import { formatCallTime } from '../../../../../../../../../helpers';
import { useFormatRecentCallDate } from '../../../../../../../../../hooks';
import {
  CallFromNumber,
  CallFromSipRegId,
  CallStatus,
  type VoximplantCall,
} from '../../../../../../../../../models';
import type { SetLastCallFromHandler } from '../../../../../../../../../types';

const Root = styled.li<{ $hoverable: boolean }>`
  width: 100%;

  display: flex;
  flex-shrink: 0;
  gap: 8px;

  padding: 12px 32px;
  transition: var(--transition-200);

  &:not(:last-child) {
    border-bottom: 1px solid var(--graphite-graphite-80);
  }

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;

        background-color: var(--graphite-graphite-20);
      }
    `}

  ${TruncateMixin}
`;

const IconWrapper = styled.div<{ $fill: CSSProperties['fill'] }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    fill: ${p => p.$fill};
  }
`;

const Content = styled.div<{ $flex?: CSSProperties['flex'] }>`
  display: flex;
  flex-direction: column;
  flex: ${p => p.$flex};
  flex-shrink: 0;
  gap: 4px;

  ${TruncateMixin}
`;

const ContactName = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

const StyledLink = styled(Link)<{ $disabled: boolean }>`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      color: var(--button-text-graphite-secondary-text);
    `}

  ${TruncateMixin}
`;

const CallInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: var(--graphite-graphite-440);
`;

const BulletDelimiter = styled.div`
  width: 2px;
  height: 2px;

  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--graphite-graphite-440);
`;

const CallTime = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const CallDate = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: var(--graphite-graphite-440);
`;

interface Props {
  call: VoximplantCall;
  callFromNumber: SelectModel;
  handleSetLastCallFrom: SetLastCallFromHandler;
}

const RecentCall = observer((props: Props) => {
  const {
    call: { phoneNumber, direction, duration, createdAt, status, entityInfo, isIncoming },
    callFromNumber,
    handleSetLastCallFrom,
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.outgoing_call_initializer',
  });

  const { callState, startOutgoingCallFromSipRegistration, startOutgoingCallFromNumber } =
    voximplantConnectorStore;

  const callDate = useFormatRecentCallDate(createdAt);

  const incoming = isIncoming();

  const positivePalette = incoming
    ? 'var(--button-text-green-default)'
    : 'var(--button-text-graphite-primary-text)';

  const callIconColor = status
    ? (
        {
          [CallStatus.CANCELED]: incoming
            ? 'var(--button-text-red-default)'
            : 'var(--button-text-graphite-primary-text)',
          [CallStatus.FAILED]: incoming
            ? 'var(--button-text-red-default)'
            : 'var(--button-text-graphite-primary-text)',
          [CallStatus.MISSED]: 'var(--button-text-red-default)',
          [CallStatus.STARTED]: positivePalette,
          [CallStatus.ACCEPTED]: positivePalette,
          [CallStatus.SUCCESS]: positivePalette,
        } satisfies Record<CallStatus, CSSProperties['fill']>
      )[status]
    : 'var(--button-text-graphite-primary-text)';

  const handleStartCall = () => {
    if (callState.call) {
      console.error(
        `Failed to start outgoing call, call already exists ${callState.call.id()}, there must be only one active call at a time`
      );

      return;
    }

    if (callFromNumber.value instanceof CallFromNumber) {
      startOutgoingCallFromNumber({
        callToNumber: phoneNumber,
        callFromNumber: callFromNumber.value.number,
      });
    } else if (callFromNumber.value instanceof CallFromSipRegId) {
      startOutgoingCallFromSipRegistration({
        callToNumber: phoneNumber,
        callFromSipRegExternalId: callFromNumber.value.sipRegId,
      });
    } else {
      throw new Error(
        `Failed to start outgoing call from RecentCall, neither callFromNumber nor sipRegId is specified: ${callFromNumber.value}`
      );
    }

    handleSetLastCallFrom(callFromNumber.value);
  };

  const handleStopPropagation: MouseEventHandler<HTMLAnchorElement> = e => e.stopPropagation();

  return (
    <Root
      $hoverable={Boolean(callFromNumber)}
      onClick={callFromNumber ? handleStartCall : undefined}
    >
      <IconWrapper $fill={callIconColor}>
        {incoming ? <RecentCallIncomingIcon /> : <RecentCallOutgoingIcon />}
      </IconWrapper>

      <Content $flex={1}>
        {entityInfo ? (
          <LinkWrapper>
            <StyledLink
              $disabled={!entityInfo.hasAccess}
              to={routes.card({ entityTypeId: entityInfo.entityTypeId, entityId: entityInfo.id })}
              onClick={handleStopPropagation}
            >
              <SpanWithEllipsis text={entityInfo.name} />
            </StyledLink>

            <Hint text={`📞 ${phoneNumber}`} />
          </LinkWrapper>
        ) : (
          <ContactName>
            <SpanWithEllipsis text={phoneNumber} />
          </ContactName>
        )}

        <CallInfo>
          {t(direction)}

          <BulletDelimiter />

          {formatCallTime(duration ?? 0)}
        </CallInfo>
      </Content>

      <Content>
        <CallTime>{createdAt.displayTime()}</CallTime>

        <CallDate>{callDate}</CallDate>
      </Content>
    </Root>
  );
});

RecentCall.displayName = 'RecentCall';
export { RecentCall };
