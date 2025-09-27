import type { ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';

const Text = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);
`;

interface RootProps {
  $active?: boolean;
  $width?: CSSProperties['width'];
  $iconChangeState?: boolean;
}

const Root = styled.button<RootProps>`
  height: 28px;
  width: ${p => p.$width};

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 4px;

  padding: 0 8px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  svg path {
    fill: ${p => p.$active && p.$iconChangeState && `var(--graphite-graphite-840)`};
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: ${p => p.$iconChangeState && `var(--graphite-graphite-840)`};
    }
  }

  &:active {
    svg path {
      fill: ${p => p.$iconChangeState && `var(--button-text-graphite-primary-text)`};
    }
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        background-color: var(--graphite-graphite-40);

        ${Text} {
          color: var(--graphite-graphite-840);
        }
      }

      &:active {
        background-color: var(--graphite-graphite-80);

        ${Text} {
          color: var(--button-text-graphite-primary-text);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      border-color: var(--primary-statuses-green-520);

      ${Text} {
        color: var(--graphite-graphite-840);
      }
    `}
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

type OmittedButtonHTMLAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'height' | 'disabled' | 'children'
>;

interface Props extends OmittedButtonHTMLAttributes {
  ref?: Ref<HTMLButtonElement>;
  Icon: ReactNode;
  text: string;
  active?: boolean;
  iconChangeState?: boolean;
  width?: CSSProperties['width'];
}

const SubheaderButton = (props: Props) => {
  const { ref, Icon, text, active, iconChangeState, width, ...rest } = props;

  return (
    <Root
      ref={ref}
      type="button"
      $active={active}
      $width={width}
      $iconChangeState={iconChangeState}
      {...rest}
    >
      <IconWrapper>{Icon}</IconWrapper>

      <Text>{text}</Text>
    </Root>
  );
};

export { SubheaderButton };
