import { FormItem, FormItemLabel, Hint } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  label: string;
  children: ReactNode;
  bold?: boolean;
  hint?: string;
  gridColumn?: string;
  minHeight?: string;
}

const AddTaskModalFormItem = (props: Props) => {
  const { label, children, bold, hint, gridColumn, minHeight } = props;

  return (
    <FormItem minHeight={minHeight} gridColumn={gridColumn} gap="8px">
      <TitleWrapper>
        <FormItemLabel
          $fontWeight={bold ? 600 : undefined}
          $color="var(--button-text-graphite-primary-text)"
        >
          {label}
        </FormItemLabel>

        {hint && <Hint text={hint} />}
      </TitleWrapper>

      {children}
    </FormItem>
  );
};

export { AddTaskModalFormItem };
