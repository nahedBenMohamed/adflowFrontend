import { SpanWithEllipsis } from '@/shared';
import type { ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $active?: boolean;
  $danger?: boolean;
}

const Root = styled.button<RootProps>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: ${p => (p.$danger ? 'var(--button-text-red-hover)' : 'var(--button-text-green-hover)')};

    svg path {
      fill: ${p => (p.$danger ? 'var(--button-text-red-hover)' : 'var(--button-text-green-hover)')};
    }
  }

  &:active {
    color: ${p =>
      p.$danger ? 'var(--button-text-red-active)' : 'var(--button-text-green-active)'};

    svg path {
      fill: ${p =>
        p.$danger ? 'var(--button-text-red-active)' : 'var(--button-text-green-active)'};
    }
  }

  ${p =>
    p.$active &&
    css`
      color: ${p.$danger ? 'var(--button-text-red-default)' : 'var(--primary-blue)'};

      svg path {
        fill: ${p.$danger ? 'var(--button-text-red-default)' : 'var(--primary-blue)'};
      }
    `}
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }
`;

interface Props {
  ref?: Ref<HTMLButtonElement>;
  text: string;
  Icon: ReactNode;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

const BatchAction = (props: Props) => {
  const { ref, text, Icon, active, danger, onClick } = props;

  return (
    <Root ref={ref} $active={active} $danger={danger} onClick={onClick}>
      <IconWrapper>{Icon}</IconWrapper>

      <SpanWithEllipsis text={text} />
    </Root>
  );
};

export { BatchAction };
