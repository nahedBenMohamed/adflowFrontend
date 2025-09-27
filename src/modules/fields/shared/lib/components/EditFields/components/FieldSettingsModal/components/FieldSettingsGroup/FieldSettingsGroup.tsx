import { Hint, SpanWithEllipsis } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div<{ $dull?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 20px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  ${p => p.$dull && `opacity: 0.5`};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  label: string | ReactNode;
  labelHint?: string;
  children?: ReactNode;
  dull?: boolean;
}

const FieldSettingsGroup = (props: Props) => {
  const { label, labelHint, children, dull } = props;

  return (
    <Root $dull={dull}>
      <Title>
        {typeof label === 'string' ? <SpanWithEllipsis text={label} /> : label}

        {labelHint && <Hint text={labelHint} />}
      </Title>

      {children}
    </Root>
  );
};

export { FieldSettingsGroup };
