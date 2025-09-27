import { routes } from '@/app';
import { CloseModalIcon, envUtil } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useMultichatContext } from '../../../../../../context';
import { FullscreenIcon } from '../../../../../assets';

const Root = styled.div`
  height: calc(var(--header-height) - 1px);

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 16px;

  padding: 14px 24px 14px 32px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);

  &:hover {
    cursor: move;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const CloseButton = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

const FullScreenLink = styled(Link)`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }
`;

const MultichatControlHeader = memo(() => {
  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.multichat_control_header',
  });

  const { hide } = useMultichatContext();

  return (
    <Root className="workspace__MultichatControlHeader--Root">
      <HeaderTitleWrapper>
        <HeaderTitle>{t('title', { company: envUtil.appName })}</HeaderTitle>
      </HeaderTitleWrapper>

      <HeaderControls>
        <FullScreenLink to={routes.multichat()} target="_blank">
          <FullscreenIcon />
        </FullScreenLink>

        <CloseButton onClick={hide}>
          <CloseModalIcon />
        </CloseButton>
      </HeaderControls>
    </Root>
  );
});

MultichatControlHeader.displayName = 'MultichatControlHeader';
export { MultichatControlHeader };
