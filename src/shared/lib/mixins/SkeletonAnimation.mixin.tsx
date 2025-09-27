import { css, keyframes } from 'styled-components';

const loading = keyframes`
  0% {
    background-color: hsl(205, 20%, 90%);
  }

  50% {
    background-color: hsl(205, 20%, 95%);
  }

  100% {
    background-color: hsl(205, 20%, 90%);
  }
`;

export const SkeletonAnimationMixin = css<{ $delay?: number }>`
  background-color: hsl(205, 20%, 90%);
  animation: ${loading} 2000ms linear infinite alternate;

  ${p => `animation-delay: ${p.$delay}ms`};
`;
