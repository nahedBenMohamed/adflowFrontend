import { FormItem, FormItemLabel, Hint } from '@/shared';
import type { CSSProperties, ReactNode } from 'react';

interface Props {
  text: string;
  children: ReactNode;
  gap?: CSSProperties['gap'];
  hint?: string;
}

const PopupFormItem = (props: Props) => {
  const { text, children, gap = '8px', hint } = props;

  return (
    <FormItem width="100%" gap={gap}>
      <FormItemLabel title={text} $gap="4px" $color="var(--button-text-graphite-primary-text)">
        {text}

        {hint && <Hint text={hint} />}
      </FormItemLabel>

      {children}
    </FormItem>
  );
};

export { PopupFormItem };
