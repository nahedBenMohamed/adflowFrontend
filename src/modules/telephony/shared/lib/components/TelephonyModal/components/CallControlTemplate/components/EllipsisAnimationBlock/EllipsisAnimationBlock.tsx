import styled, { css, keyframes } from 'styled-components';

const ellipsis = keyframes`
  to {
    width: 1.2em;
  }
`;

const Root = styled.div<{ $folded: boolean }>`
  position: relative;

  font-size: 18px;
  font-weight: 400;
  line-height: 25px;
  font-variant: tabular-nums;
  color: var(--button-text-graphite-primary-text);

  padding-right: 16px;

  &::after {
    content: '...';

    position: absolute;

    width: 0px;
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ${ellipsis} steps(4, end) 1s infinite;
    animation: ${ellipsis} steps(4, end) 1s infinite;
  }

  ${p =>
    p.$folded &&
    css`
      font-size: 14px;
      line-height: 20px;
      color: var(--primary-statuses-white-0);

      padding-right: 12px;
    `}
`;

interface Props {
  title: string;
  folded: boolean;
}

const EllipsisAnimationBlock = (props: Props) => {
  const { title, folded } = props;

  return <Root $folded={folded}>{title}</Root>;
};

export { EllipsisAnimationBlock };
