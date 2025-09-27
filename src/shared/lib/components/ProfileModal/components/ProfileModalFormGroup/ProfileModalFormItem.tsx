import type { ReactNode } from 'react';
import { FormItem, FormItemLabel } from '../../../Form/components';
import { Hint } from '../../../Hint/Hint';

interface Props {
  label: string;
  children: ReactNode;
  hint?: string;
}

const ProfileModalFormGroup = (props: Props) => {
  const { label, children, hint } = props;

  return (
    <FormItem gap="8px">
      <FormItemLabel as="div" $gap="8px" $color="var(--button-text-graphite-primary-text)">
        {label}

        {hint && <Hint text={hint} />}
      </FormItemLabel>

      {children}
    </FormItem>
  );
};

export { ProfileModalFormGroup };
