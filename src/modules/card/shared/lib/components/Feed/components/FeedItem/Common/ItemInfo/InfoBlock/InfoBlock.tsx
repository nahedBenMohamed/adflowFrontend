import { Hint, MyIndicator, SpanWithEllipsis, TruncateMixin } from '@/shared';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  overflow: hidden;
`;

const Title = styled.div<{ $isResolvedTask?: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p =>
    p.$isResolvedTask
      ? `var(--button-text-graphite-secondary-text)`
      : `var(--button-text-graphite-primary-text)`};

  padding-bottom: 2px;
`;

const MainContent = styled.div<{ $isResolvedTask?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p =>
    p.$isResolvedTask
      ? `var(--button-text-graphite-secondary-text)`
      : `var(--button-text-graphite-priory-text)`};
`;

export type FrameVariant = 'none' | 'outlined' | 'green-outline' | 'outlined-with-dark-icon';

interface IconWrapperProps {
  $isResolvedTask?: boolean;
  $frameVariant?: FrameVariant;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);

    ${p => p.$isResolvedTask && `fill: var(--button-text-graphite-secondary-text);`}
  }

  ${p => p.$frameVariant === 'outlined' && `border: 1px solid var(--graphite-graphite-80)`};

  ${p =>
    p.$frameVariant === 'green-outline' &&
    css`
      border: 1px solid var(--primary-statuses-green-520);

      svg path {
        fill: var(--graphite-graphite-840);
      }
    `}

  ${p =>
    p.$frameVariant === 'outlined-with-dark-icon' &&
    css`
      border: 1px solid var(--graphite-graphite-80);

      svg path {
        fill: var(--graphite-graphite-840);
      }
    `}
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

export type IndicatorVariant = 'green' | 'red';

interface Props {
  title: string;
  info: string | ReactNode;
  children: ReactNode;
  infoMeta?: string;
  showTitle?: boolean;
  isResolvedTask?: boolean;
  frameVariant?: FrameVariant;
  indicatorVariant?: IndicatorVariant;
}

const InfoBlock = (props: Props) => {
  const {
    title,
    info,
    children,
    infoMeta,
    showTitle,
    isResolvedTask,
    frameVariant,
    indicatorVariant,
  } = props;

  const BlockWithIcon = (
    <IconWrapper $frameVariant={frameVariant} $isResolvedTask={isResolvedTask}>
      {children}
    </IconWrapper>
  );

  return (
    <Root>
      <Title $isResolvedTask={isResolvedTask}>{title}</Title>

      <MainContent $isResolvedTask={isResolvedTask}>
        {indicatorVariant ? (
          <MyIndicator
            size={10}
            withBorder
            offset={6}
            position="bottom-end"
            color={
              indicatorVariant === 'red'
                ? 'var(--primary-statuses-red-360)'
                : 'var(--primary-statuses-green-520)'
            }
          >
            {BlockWithIcon}
          </MyIndicator>
        ) : (
          BlockWithIcon
        )}

        {typeof info === 'string' ? (
          <InfoWrapper>
            <SpanWithEllipsis text={info} showTitle={showTitle} />

            {infoMeta && <Hint text={infoMeta} />}
          </InfoWrapper>
        ) : (
          info
        )}
      </MainContent>
    </Root>
  );
};

export { InfoBlock };
