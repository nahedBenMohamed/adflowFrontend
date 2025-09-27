import { DropdownScrollbarMixin, MyDropdown, type Icon } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { ExpandMoreIcon } from '../../../assets';

const IconsBlock = styled.div`
  width: 286px;
  max-height: 320px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  ${DropdownScrollbarMixin}

  padding: 8px;
`;

const IconWrapper = styled.div<{ active: boolean; color: string }>`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-block);
  background-color: ${p => (p.active ? p.color : 'transparent')};
  transition: var(--transition-200);

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p =>
      p.active ? `var(--primary-statuses-white-0)` : `var(--button-text-graphite-primary-text)`};

    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg rect,
    svg circle,
    svg ellipse,
    svg path {
      fill: ${p => !p.active && 'var(--graphite-graphite-200)'};
    }
  }
`;

const IconPreview = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${p => p.$color};
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: var(--primary-statuses-white-0);
  }
`;

const ExpandMoreIconWrapper = styled.div<{ $arrowUp: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  transition: var(--transition-200);
  transform: rotate(${p => (p.$arrowUp ? 180 : 0)}deg);
`;

const IconPickerButton = styled.div`
  width: 60px;
  height: 40px;

  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  opened: boolean;
  icons: Icon[];
  moduleColor: string;
  selectedIcon: Icon;
  hide: () => void;
  show: () => void;
  chooseIcon: (icon: Icon) => void;
}

const SectionIconPicker = observer((props: Props) => {
  const { opened, icons, moduleColor, selectedIcon, hide, show, chooseIcon } = props;

  return (
    <MyDropdown
      withinPortal
      position="bottom-start"
      opened={opened}
      Button={
        <IconPickerButton>
          <IconPreview $color={moduleColor}>{selectedIcon.icon}</IconPreview>

          <ExpandMoreIconWrapper $arrowUp={opened}>
            <ExpandMoreIcon />
          </ExpandMoreIconWrapper>
        </IconPickerButton>
      }
      hide={hide}
      show={show}
    >
      <IconsBlock>
        {icons.map(i => (
          <IconWrapper
            key={i.name}
            color={moduleColor}
            active={i.name === selectedIcon.name}
            onClick={() => chooseIcon(i)}
          >
            {i.icon}
          </IconWrapper>
        ))}
      </IconsBlock>
    </MyDropdown>
  );
});

SectionIconPicker.displayName = 'SectionIconPicker';
export { SectionIconPicker };
