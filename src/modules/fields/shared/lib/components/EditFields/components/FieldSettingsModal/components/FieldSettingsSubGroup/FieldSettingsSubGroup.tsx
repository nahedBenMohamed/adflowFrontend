import { Hint, SpanWithEllipsis } from '@/shared';
import { TruncateMixin } from '@/shared/lib/mixins/Truncate.mixin';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  padding-left: 16px;
`;

const Label = styled.div`
  width: 208px;

  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const Content = styled.div`
  width: 224px;
`;

interface Props {
  label: string;
  children: ReactNode;
  labelHint?: string;
}

const FieldSettingsSubGroup = (props: Props) => {
  const { label, children, labelHint } = props;

  return (
    <Root>
      <Label>
        <SpanWithEllipsis text={label} />

        {labelHint && <Hint text={labelHint} />}
      </Label>

      <Content>{children}</Content>
    </Root>
  );
};

export { FieldSettingsSubGroup };
