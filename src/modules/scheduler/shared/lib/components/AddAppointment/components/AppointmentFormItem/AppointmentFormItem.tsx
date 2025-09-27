import { FormGroup, Label } from '@/shared';
import { memo, type CSSProperties, type ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
  alignItems?: CSSProperties['alignItems'];
}

const AppointmentFormItem = memo((props: Props) => {
  const { label, children, alignItems } = props;

  return (
    <FormGroup
      $gap="16px"
      $margin={0}
      $mobileColumn
      $alignItems={alignItems}
      $gridTemplateColumns="calc(40% - 16px) 60%"
    >
      <Label $color="var(--button-text-graphite-primary-text)">{label}</Label>

      {children}
    </FormGroup>
  );
});

AppointmentFormItem.displayName = 'AppointmentFormItem';
export { AppointmentFormItem };
