import type { ReactNode } from 'react';
import { FormItem } from '../../../Form/components/FormItem/FormItem';
import { FormItemLabel } from '../../../Form/components/FormItemLabel/FormItemLabel';

interface Props {
  text: string;
  children: ReactNode;
  hint?: string;
}

const HeadlessFormItem = (props: Props) => {
  const { text, children } = props;

  return (
    <FormItem gap="8px">
      <FormItemLabel title={text} $color="var(--button-text-graphite-primary-text)">
        {text}
      </FormItemLabel>

      {children}
    </FormItem>
  );
};

export { HeadlessFormItem };
