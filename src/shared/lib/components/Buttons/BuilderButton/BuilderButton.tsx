import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { BuilderTabs } from '@/modules/builder';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MyTooltip } from '../../MyTooltip/MyTooltip/MyTooltip';
import { BuilderButtonIcon } from './components';

const Root = styled.div`
  height: var(--header-height);
  width: var(--sidebar-width);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-right: 1px solid var(--graphite-graphite-80);
  background-color: var(--graphite-graphite-840);
`;

const Wrapper = styled(Link)`
  outline: none;

  height: var(--header-height);
  width: var(--sidebar-width);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WrapperWithBorder = styled.div`
  width: 40px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  border-bottom: 1px solid var(--graphite-graphite-680);
`;

const BuilderButton = memo(() => {
  const { t } = useTranslation('common', {
    keyPrefix: 'sidebar',
  });

  const isAdmin = authStore.isAdmin();

  return (
    <Root>
      {isAdmin ? (
        <Wrapper to={routes.builder(BuilderTabs.JOURNEY)}>
          <WrapperWithBorder>
            <MyTooltip offset={6} position="right" label={t('builder')}>
              <BuilderButtonIcon />
            </MyTooltip>
          </WrapperWithBorder>
        </Wrapper>
      ) : (
        <WrapperWithBorder>
          <BuilderButtonIcon />
        </WrapperWithBorder>
      )}
    </Root>
  );
});

BuilderButton.displayName = 'BuilderButton';
export { BuilderButton };
