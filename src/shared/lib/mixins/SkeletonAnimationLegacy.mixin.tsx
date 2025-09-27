import { css, keyframes } from 'styled-components';

const loading = keyframes`
  0% {
    background-color: hsl(205, 20%, 90%);
  }

  100% {
    background-color: hsl(205, 20%, 95%);
  }
`;

export const SkeletonAnimationMixinLegacy = css`
  animation: ${loading} 750ms linear infinite alternate;
`;
