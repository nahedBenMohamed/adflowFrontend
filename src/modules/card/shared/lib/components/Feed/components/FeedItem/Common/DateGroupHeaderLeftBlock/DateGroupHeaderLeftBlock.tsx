import styled from 'styled-components';
import { FeedHorizontalLine, FeedVerticalLine } from '../Item/Item';

const LEFT_ICON_BLOCK_WIDTH = '36px';

export const Root = styled.div`
  width: ${LEFT_ICON_BLOCK_WIDTH};

  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const DateGroupHeaderLeftBlock = () => {
  return (
    <Root>
      <FeedHorizontalLine $transparent $hasMarginBottom />

      <FeedVerticalLine $height={56} />

      <FeedHorizontalLine $hasMarginBottom />
    </Root>
  );
};

export { DateGroupHeaderLeftBlock };
