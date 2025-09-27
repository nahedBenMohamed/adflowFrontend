import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';

const variables = {
  color: 'var(--button-text-green-default)',
};

const Wrapper = styled.div<{ $height?: CSSProperties['height'] }>`
  height: ${p => p.$height ?? '100%'};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(270deg);
  } 
`;

const Svg = styled.svg`
  animation: ${rotate} 1.4s linear infinite;
`;

const colors = keyframes`
  0% {
    stroke: ${variables.color};
  }

  100% {
    stroke: ${variables.color};
  }
`;

const dash = keyframes`
  0% {
    stroke-dashoffset: 187;
  }

  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
`;

const Circle = styled.circle`
  stroke-dashoffset: 0;
  stroke-dasharray: 187;
  transform-origin: center;
  animation:
    ${dash} 1.4s ease-in-out infinite,
    ${colors} 5.6s ease-in-out infinite;
`;

interface Props {
  height?: string;
}

const DefaultLoader = (props: Props) => {
  const { height } = props;

  const { t } = useTranslation();

  return (
    <Wrapper title={t('loading_title')} $height={height}>
      <Svg width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <Circle fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30" />
      </Svg>
    </Wrapper>
  );
};

export { DefaultLoader };
