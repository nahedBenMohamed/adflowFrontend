import { routes } from '@/app';
import { formatTelephonyPhoneNumber } from '@/modules/telephony';
import { SpanWithEllipsis, type EntityInfo } from '@/shared';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const CallIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StyledLink = styled(Link)<{ $disabled: boolean }>`
  font-weight: 500;
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
`;

interface Props {
  callIcon: ReactNode;
  currentPathname: string;
  phoneNumber?: string;
  entityInfo?: EntityInfo;
}

const ContactParticipant = (props: Props) => {
  const { callIcon, currentPathname, phoneNumber, entityInfo } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_calls_history_report_columns',
  });

  const phone = phoneNumber ? formatTelephonyPhoneNumber(phoneNumber) : undefined;

  return (
    <Root>
      <CallIconWrapper>{callIcon}</CallIconWrapper>

      {entityInfo ? (
        <StyledLink
          $disabled={!entityInfo.hasAccess}
          to={routes.card({
            from: currentPathname,
            entityId: entityInfo.id,
            entityTypeId: entityInfo.entityTypeId,
          })}
        >
          <SpanWithEllipsis text={entityInfo.name} />
        </StyledLink>
      ) : (
        phone || t('unknown')
      )}
    </Root>
  );
};

export { ContactParticipant };
