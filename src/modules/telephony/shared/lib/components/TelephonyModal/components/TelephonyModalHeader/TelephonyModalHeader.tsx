import {
  CloseModalIcon,
  LogoFlowerIcon,
  SpanWithEllipsis,
  TruncateMixin,
  envUtil,
  type Nullable,
} from '@/shared';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useTelephonyContext } from '../../../../../../context';
import { CloseSmallIcon, FoldIcon, UnfoldIcon } from '../../../../../assets';
import { formatTelephonyPhoneNumber } from '../../../../helpers';
import { HeaderControlButtonBase } from './components';

const Root = styled.div<{ $folded: boolean }>`
  height: ${p => !p.$folded && 'var(--telephony-header-height)'};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 14px ${p => (p.$folded ? '12px' : '32px')};
  border-bottom: 1px solid var(--graphite-graphite-80);

  &:hover {
    cursor: move;
  }
`;

const TitleWrapper = styled.div<{ $folded: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  font-weight: ${p => (p.$folded ? 500 : 600)};
  color: ${p =>
    p.$folded ? 'var(--primary-statuses-white-0)' : 'var(--button-text-graphite-priory-text)'};

  ${TruncateMixin}
`;

const LogoIconWrapper = styled.div<{ $folded: boolean }>`
  height: ${p => (p.$folded ? '16px' : '20px')};
  width: ${p => (p.$folded ? '16px' : '20px')};

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled(HeaderControlButtonBase)`
  ${p =>
    p.$folded
      ? css`
          &:active {
            scale: 0.9;
          }
        `
      : css`
          &:hover {
            svg path {
              fill: var(--button-text-red-hover);
            }
          }

          &:active {
            svg path {
              fill: var(--button-text-red-active);
            }
          }
        `}
`;

const FoldButton = styled(HeaderControlButtonBase)`
  ${p =>
    p.$folded
      ? css`
          &:active {
            scale: 0.9;
          }
        `
      : css`
          &:hover {
            svg path {
              fill: var(--button-text-blue-hover);
            }
          }

          &:active {
            svg path {
              fill: var(--button-text-blue-active);
            }
          }
        `}
`;

interface Props {
  canFold: boolean;
  displayPhone?: string;
  entityName?: string;
}

const TelephonyModalHeader = memo((props: Props) => {
  const { canFold, displayPhone, entityName } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal',
  });

  const { folded, hide, toggleFolded } = useTelephonyContext();

  const formattedPhoneNumber = useMemo<Nullable<string>>(
    () => (displayPhone ? formatTelephonyPhoneNumber(displayPhone) : null),
    [displayPhone]
  );

  const logoSize = folded ? 16 : 20;

  return (
    <Root className="workspace__TelephonyModalHeader--Root" $folded={folded}>
      <TitleWrapper $folded={folded}>
        <LogoIconWrapper $folded={folded}>
          <LogoFlowerIcon width={logoSize} height={logoSize} />
        </LogoIconWrapper>

        {/* entityName has higher display priority in folded modal header */}
        <SpanWithEllipsis
          text={
            folded
              ? (entityName ??
                formattedPhoneNumber ??
                t('amwork_calls', { company: envUtil.appName }))
              : t('amwork_calls', { company: envUtil.appName })
          }
        />
      </TitleWrapper>

      <Controls>
        {canFold && (
          <FoldButton $folded={folded} onClick={toggleFolded}>
            {folded ? <UnfoldIcon /> : <FoldIcon />}
          </FoldButton>
        )}

        <CloseButton $folded={folded} onClick={hide}>
          {folded ? <CloseSmallIcon /> : <CloseModalIcon />}
        </CloseButton>
      </Controls>
    </Root>
  );
});

TelephonyModalHeader.displayName = 'TelephonyModalHeader';
export { TelephonyModalHeader };
