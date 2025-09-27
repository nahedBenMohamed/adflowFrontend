import { css } from 'styled-components';

export interface FadedHorizontalScrollMixinProps {
  $showLeftFade?: boolean;
  $showRightFade?: boolean;
}

export const FadedHorizontalScrollMixin = css<FadedHorizontalScrollMixinProps>`
  ${({ $showLeftFade, $showRightFade }) => {
    if ($showLeftFade && $showRightFade) {
      return css`
        mask-image: linear-gradient(
          to right,
          transparent,
          var(--primary-statuses-white-0) 24px,
          var(--primary-statuses-white-0) calc(100% - 24px),
          transparent
        );
      `;
    }

    if ($showLeftFade) {
      return css`
        mask-image: linear-gradient(to right, transparent, var(--primary-statuses-white-0) 24px);
      `;
    }

    if ($showRightFade) {
      return css`
        mask-image: linear-gradient(to left, transparent, var(--primary-statuses-white-0) 24px);
      `;
    }

    return '';
  }}
`;
