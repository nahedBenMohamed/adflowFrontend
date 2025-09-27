import { MyTooltip } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MenuIcon } from '../../../../assets';

const Root = styled.button<{ $active?: boolean }>`
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: ${p => !p.$active && 'var(--graphite-graphite-40)'};
  }

  ${p => p.$active && `background-color: var(--graphite-graphite-80)`};
`;

interface Props {
  active?: boolean;
  sidebarShown?: boolean;
  onClick: () => void;
}

const MenuButton = memo((props: Props) => {
  const { active, sidebarShown, onClick } = props;

  const { t } = useTranslation('common');

  return (
    <MyTooltip withinPortal label={sidebarShown ? t('hide_sidebar') : t('show_sidebar')}>
      <Root type="button" $active={active} onClick={onClick}>
        <MenuIcon />
      </Root>
    </MyTooltip>
  );
});

MenuButton.displayName = 'MenuButton';
export { MenuButton };
