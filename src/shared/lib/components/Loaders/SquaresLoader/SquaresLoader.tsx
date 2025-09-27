import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';

const squares = keyframes`
  0% {
    transform: scaleX(var(--s, 1)) translate(0) scale(1);
  }

  33% {
    transform: scaleX(var(--s, 1)) translate(calc(50% + 2.5px)) scale(1);
  }

  66% {
    transform: scaleX(var(--s, 1)) translate(calc(50% + 2.5px)) scale(2);
  }

  100% {
    transform: scaleX(var(--s, 1)) translate(0) scale(1);
  }
`;

const Root = styled.div`
  display: inline-flex;
  gap: 5px;

  &::before,
  &::after {
    content: '';

    width: 25px;

    aspect-ratio: 1;
    box-shadow: 0 0 0 3px inset #181816;
    animation: ${squares} 1.5s infinite;
  }

  &::after {
    --s: -1;
  }
`;

const SquaresLoader = () => {
  const { t } = useTranslation();

  return <Root title={t('loading_title')} />;
};

export { SquaresLoader };
