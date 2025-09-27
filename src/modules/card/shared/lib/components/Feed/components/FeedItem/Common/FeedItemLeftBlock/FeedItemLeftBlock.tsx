import { memo, type CSSProperties, type ReactNode } from 'react';
import styled from 'styled-components';
import { FeedVerticalLine } from '../Item/Item';

const Root = styled.div<{ $paddingTop: CSSProperties['paddingTop'] }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: ${p => p.$paddingTop};
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  transition: var(--transition-200);
`;

interface Props {
  Icon: ReactNode;
  topLineHeight?: number;
  hideTopLine?: boolean;
  hideBottomLine?: boolean;
  paddingTop?: CSSProperties['paddingTop'];
}

const FeedItemLeftBlock = memo((props: Props) => {
  const { Icon, topLineHeight, hideTopLine, hideBottomLine, paddingTop } = props;

  return (
    <Root $paddingTop={paddingTop}>
      {!hideTopLine && <FeedVerticalLine $height={topLineHeight ?? 10} />}

      <IconWrapper>{Icon}</IconWrapper>

      {!hideBottomLine && <FeedVerticalLine />}
    </Root>
  );
});

FeedItemLeftBlock.displayName = 'FeedItemLeftBlock';
export { FeedItemLeftBlock };
