import { PrimaryButton, truncateNumber } from '@/shared';
import { Transition } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinkProps } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.li`
  position: relative;

  width: 246px;
  height: 223px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

const TopBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconContainer = styled.div<{ $iconSize?: CSSProperties['width'] }>`
  width: 100%;
  height: 103px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg {
    min-width: ${p => p.$iconSize ?? 'unset'};
    min-height: ${p => p.$iconSize ?? 'unset'};

    max-width: 80%;
    max-height: 80%;
  }
`;

const Description = styled.div`
  height: 40px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);
`;

const Controls = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CountTag = styled.div<{ $moreThanOneDigit: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;

  height: 20px;
  width: ${p => (p.$moreThanOneDigit ? 32 : 20)}px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--primary-statuses-white-0);

  border-radius: 20px;
  background: var(--primary-statuses-green-520);
`;

interface Props {
  Icon: ReactNode;
  description: string;
  count?: number;
  installTitle?: string;
  highlightedButton?: boolean;
  iconSize?: CSSProperties['width'];
  onManageLinkProps?: LinkProps;
  onInstallLinkProps?: LinkProps;
  onManage?: () => void;
  onInstall?: () => void;
}

const IntegrationItem = (props: Props) => {
  const {
    Icon,
    description,
    count,
    installTitle,
    iconSize,
    highlightedButton,
    onManageLinkProps,
    onInstallLinkProps,
    onManage,
    onInstall,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.integration_item',
  });

  return (
    <Root>
      <Transition mounted={Boolean(count)} transition="pop">
        {transitionStyles => (
          <CountTag $moreThanOneDigit={(count ?? 0) > 9} style={{ ...transitionStyles }}>
            {truncateNumber({ num: count ?? 0, precision: 3 })}
          </CountTag>
        )}
      </Transition>

      <TopBlock>
        <IconContainer $iconSize={iconSize}>{Icon}</IconContainer>

        <Description>{description}</Description>
      </TopBlock>

      <Controls>
        <Transition mounted={Boolean(onManageLinkProps || onManage)} transition="scale">
          {styles => (
            <div style={{ ...styles }}>
              <PrimaryButton linkProps={onManageLinkProps} variant="empty" onClick={onManage}>
                {t('manage')}
              </PrimaryButton>
            </div>
          )}
        </Transition>

        <PrimaryButton
          variant={highlightedButton ? 'highlighted' : undefined}
          linkProps={onInstallLinkProps}
          onClick={onInstall}
        >
          {installTitle ?? t('install')}
        </PrimaryButton>
      </Controls>
    </Root>
  );
};

export { IntegrationItem };
