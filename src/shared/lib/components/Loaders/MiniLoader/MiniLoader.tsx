import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

interface RootProps {
  $size: Size;
  $color: string;
  $margin: string;
  $hidden?: boolean;
}

const Root = styled.div<RootProps>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${p =>
    p.$size === 'small' &&
    css`
      display: flex;
      justify-content: center;
    `}

  margin: ${p => p.$margin};

  div {
    width: ${p => (p.$size === 'small' ? '12px' : '16px')};
    height: ${p => (p.$size === 'small' ? '12px' : '16px')};

    position: absolute;

    border: 2px solid ${p => p.$color};
    border-radius: 50%;
    animation: ${loading} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${p => p.$color} transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  ${p => p.$hidden && `visibility: hidden`};
`;

type Size = 'small' | 'medium';

interface Props {
  size?: Size;
  color?: string;
  margin?: string;
  visibilityHidden?: boolean;
}

const MiniLoader = (props: Props) => {
  const { margin = '0px', color = 'white', size = 'medium', visibilityHidden } = props;

  const { t } = useTranslation();

  return (
    <Root
      $size={size}
      $color={color}
      $margin={margin}
      $hidden={visibilityHidden}
      title={t('loading_title')}
    >
      <div />
      <div />
      <div />
      <div />
    </Root>
  );
};

export { MiniLoader };
