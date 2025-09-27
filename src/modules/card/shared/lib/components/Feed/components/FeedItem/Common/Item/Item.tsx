import styled from 'styled-components';

export const FeedItemWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-shrink: 0;

  // to hide box-shadow under filter block
  padding-right: 2px;
`;

export const ItemInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const FeedVerticalLine = styled.hr<{ $height?: number }>`
  width: 1px;
  height: ${p => p.$height}px;

  ${p => !p.$height && `flex: 1;`}

  background-color: var(--graphite-graphite-120);
`;

interface FeedHorizontalLineProps {
  $width?: number;
  $transparent?: boolean;
  $hasMarginBottom?: boolean;
}

export const FeedHorizontalLine = styled.hr<FeedHorizontalLineProps>`
  height: 1px;
  width: ${p => p.$width}px;

  flex: ${p => !p.$width && 1};
  flex-shrink: 0;

  margin-bottom: ${p => p.$hasMarginBottom && 16}px;
  background-color: ${p => (p.$transparent ? 'transparent' : 'var(--graphite-graphite-120)')};
`;
