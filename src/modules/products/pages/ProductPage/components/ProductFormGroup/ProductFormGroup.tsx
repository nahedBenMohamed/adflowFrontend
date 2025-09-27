import { FormGroup, Label, SpanWithEllipsis } from '@/shared';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

const ProductFormGroup = (props: Props) => {
  const { label, children } = props;

  return (
    <FormGroup $cardFields $gap="8px" $margin={0}>
      <Label $color="var(--button-text-graphite-primary-text)">
        <SpanWithEllipsis text={label} />
      </Label>

      {children}
    </FormGroup>
  );
};

export { ProductFormGroup };
