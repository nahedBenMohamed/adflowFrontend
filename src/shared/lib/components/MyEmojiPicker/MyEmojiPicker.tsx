import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useDisclosure } from '@mantine/hooks';
import type { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { EmojiMediumIcon, EmojiSmallIcon } from '../../../assets';
import { MyDropdown, type MyDropdownProps } from '../MyDropdown/MyDropdown';

interface IconWrapperProps {
  $size: IconSize;
  $active: boolean;
}

const IconWrapper = styled.div<IconWrapperProps>`
  ${p =>
    p.$size === 'small' &&
    css`
      width: 16px;
      height: 16px;
    `}

  ${p =>
    p.$size === 'medium' &&
    css`
      width: 24px;
      height: 24px;
    `}

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-active);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-hover);
      }
    `}
`;

type OmittedMyDropdownProps = Omit<
  MyDropdownProps,
  'Button' | 'show' | 'hide' | 'opened' | 'children'
>;

type IconSize = 'small' | 'medium';

interface Props extends OmittedMyDropdownProps {
  ButtonWrapper?: ComponentType<{ children: ReactNode }>;
  iconSize?: IconSize;
  onSelect: (emoji: EmojiMartData) => void;
}

const MyEmojiPicker = (props: Props) => {
  const { ButtonWrapper, iconSize = 'small', onSelect, ...rest } = props;

  const { i18n } = useTranslation();

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const IconComponent = (
    <IconWrapper $active={opened} $size={iconSize}>
      {iconSize === 'small' && <EmojiSmallIcon />}
      {iconSize === 'medium' && <EmojiMediumIcon />}
    </IconWrapper>
  );

  return (
    <MyDropdown
      {...rest}
      opened={opened}
      Button={ButtonWrapper ? <ButtonWrapper>{IconComponent}</ButtonWrapper> : IconComponent}
      show={show}
      hide={hide}
    >
      <Picker
        theme="light"
        previewPosition="none"
        data={data}
        onEmojiSelect={onSelect}
        locale={i18n.language}
        emojiButtonColors={['var(--graphite-graphite-40)']}
      />
    </MyDropdown>
  );
};

export { MyEmojiPicker };
