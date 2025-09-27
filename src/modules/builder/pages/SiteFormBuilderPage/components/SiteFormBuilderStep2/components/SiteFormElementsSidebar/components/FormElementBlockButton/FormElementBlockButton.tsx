import { Hint, SpanWithEllipsis, TruncateMixin } from '@/shared';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

const Title = styled.div`
  flex: 1;
  display: flex;

  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  ${TruncateMixin}
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 6px;
  background-color: var(--graphite-graphite-840);
  transition: var(--transition-200);

  svg path,
  rect {
    transition: var(--transition-200);
  }
`;

const Root = styled.button`
  width: 100%;
  height: 56px;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 8px 12px 8px 8px;
  border-radius: var(--border-radius-block);
  background-color: var(--graphite-graphite-40);
  transition: var(--transition-200);

  &:not(:disabled):hover {
    cursor: pointer;

    &:not(&[data-active='true']):not(:active) {
      background-color: #e6fbda;

      ${Title} {
        color: var(--graphite-graphite-840);
      }

      ${IconWrapper} {
        svg path,
        rect {
          fill: var(--primary-statuses-green-520);
        }
      }
    }
  }

  &:not(:disabled):active,
  &[data-active='true'] {
    background-color: #e6fbda;

    ${Title} {
      color: var(--button-text-graphite-priory-text);
    }

    ${IconWrapper} {
      background-color: var(--primary-statuses-green-520);
    }

    ${IconWrapper} {
      svg path,
      rect {
        fill: var(--primary-statuses-white-0);
      }
    }
  }

  &:disabled {
    cursor: default;

    ${Title} {
      color: var(--button-text-graphite-secondary-text);
    }

    ${IconWrapper} {
      background-color: var(--button-text-graphite-secondary-text);
    }
  }
`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  Icon: ReactNode;
  hint?: string;
  active?: boolean;
}

const FormElementBlockButton = (props: Props) => {
  const { title, Icon, hint, active, disabled, onClick, ...rest } = props;

  return (
    <Root
      type="button"
      disabled={disabled}
      data-active={active}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      <IconWrapper>{Icon}</IconWrapper>

      <Title>
        <SpanWithEllipsis text={title} />
      </Title>

      {hint && <Hint text={hint} size="big" />}
    </Root>
  );
};

export { FormElementBlockButton };
