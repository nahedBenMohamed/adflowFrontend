import { InfoSmallIcon, MyHoverCard, SpanWithEllipsis } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div<{ $withMinHeight?: boolean }>`
  position: relative;

  width: 100%;
  min-height: ${p => p.$withMinHeight && `58px`};

  display: flex;
  flex-direction: column;
  align-items: center;

  font-weight: 600;
  font-size: 18px;
  line-height: 29px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);

  padding: 0 20px;
`;

const HintWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;
  }

  svg path,
  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path,
    svg rect {
      fill: var(--button-text-graphite-primary-text);
    }
  }
`;

const HintTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: var(--primary-statuses-white-0);
  text-align: left;

  padding: 4px 8px;

  ul {
    list-style: unset;
    padding: 0 0 0 1rem;
  }
`;

interface Props {
  title: string;
  hint?: ReactNode;
  subtitle?: string;
  withMinHeight?: boolean;
  children?: ReactNode;
}

const BlockHeader = observer((props: Props) => {
  const { title, subtitle, hint, withMinHeight = true, children } = props;

  return (
    <Root $withMinHeight={withMinHeight}>
      {title}
      {subtitle && <SpanWithEllipsis text={subtitle} showTitle={false} />}
      {children}
      {hint && (
        <MyHoverCard
          withArrow
          withinPortal
          maxWidth={400}
          closeDelay={0}
          position="bottom"
          backgroundColor="var(--button-text-graphite-primary-text)"
          target={
            <HintWrapper>
              <InfoSmallIcon />
            </HintWrapper>
          }
        >
          <HintTextWrapper>{hint}</HintTextWrapper>
        </MyHoverCard>
      )}
    </Root>
  );
});

BlockHeader.displayName = 'BlockHeader';
export { BlockHeader };
