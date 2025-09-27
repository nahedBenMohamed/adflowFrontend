import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, type LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { GreenPlusFilledIcon } from '../../../../assets';
import { MyTooltip } from '../../MyTooltip/MyTooltip/MyTooltip';

const Text = styled.span<{ $active?: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p =>
    p.$active ? `var(--graphite-graphite-840)` : `var(--button-text-graphite-primary-text)`};
  transition: var(--transition-200);
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg rect {
    transition: var(--transition-200);
  }
`;

interface RootProps {
  $active?: boolean;
  $invalid?: boolean;
  $loading?: boolean;
  $width?: CSSProperties['width'];
}

const CommonStyles = css<RootProps>`
  height: 32px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  border-radius: 32px;
  padding: 4px 12px 4px 8px;
  background-color: var(--graphite-graphite-40);
  border: ${p =>
    p.$active
      ? `1px solid var(--primary-statuses-green-520)`
      : `1px solid var(--graphite-graphite-80)`};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        ${Text} {
          color: var(--graphite-graphite-840);
        }

        ${IconWrapper} {
          svg rect {
            fill: var(--button-text-green-active);
          }
        }
      }

      &:active {
        background-color: var(--graphite-graphite-80);

        ${Text} {
          color: var(--button-text-graphite-primary-text);
        }

        ${IconWrapper} {
          svg rect {
            fill: var(--button-text-green-hover);
          }
        }
      }
    `}

  ${p => p.$invalid && `border-color: var(--button-text-red-hover)`};

  ${p =>
    p.$loading &&
    css`
      pointer-events: none;

      opacity: 0.5;
    `};

  ${p => p.$width && `width: ${p.$width}`};
`;

const Root = styled.button<RootProps>`
  ${CommonStyles}
`;

const RootFrame = styled.div<RootProps>`
  ${CommonStyles}
`;

const RootLink = styled(Link)<RootProps>`
  ${CommonStyles}
`;

type OmittedButtonHTMLAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'height' | 'disabled' | 'children'
>;

interface Props extends OmittedButtonHTMLAttributes {
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>;
  linkProps?: LinkProps;
  isButtonFrame?: boolean;
  titleType?: 'create' | 'add';
  active?: boolean;
  invalid?: boolean;
  customTitle?: string;
  tooltip?: string;
  isLoading?: boolean;
  width?: CSSProperties['width'];
}

const CreateButton = (props: Props) => {
  const {
    ref,
    linkProps,
    titleType,
    isButtonFrame,
    active,
    invalid,
    customTitle,
    tooltip,
    isLoading,
    width,
    ...rest
  } = props;

  const { t } = useTranslation();

  const ButtonContent = (
    <>
      <IconWrapper>
        <GreenPlusFilledIcon />
      </IconWrapper>

      <Text $active={active}>
        {customTitle
          ? customTitle
          : titleType === 'create'
            ? t('buttons.create')
            : t('buttons.add')}
      </Text>
    </>
  );

  const Component = (): ReactNode => {
    switch (true) {
      case linkProps !== undefined:
        return (
          <RootLink
            ref={ref as RefObject<HTMLAnchorElement>}
            $active={active}
            $invalid={invalid}
            $loading={isLoading}
            $width={width}
            {...linkProps}
          >
            {ButtonContent}
          </RootLink>
        );

      case isButtonFrame:
        return (
          <RootFrame
            ref={ref as RefObject<HTMLDivElement>}
            $active={active}
            $invalid={invalid}
            $loading={isLoading}
            $width={width}
          >
            {ButtonContent}
          </RootFrame>
        );

      default:
        return (
          <Root
            ref={ref as RefObject<HTMLButtonElement>}
            $active={active}
            $invalid={invalid}
            $loading={isLoading}
            $width={width}
            {...rest}
          >
            {ButtonContent}
          </Root>
        );
    }
  };

  return tooltip ? (
    <MyTooltip withinPortal label={tooltip}>
      {Component()}
    </MyTooltip>
  ) : (
    Component()
  );
};

export { CreateButton };
