import { FormGroup, Hint, Label, SpanWithEllipsis } from '@/shared';
import type { CSSProperties, ReactNode } from 'react';

interface Props {
  text: string;
  children: ReactNode;
  hintText?: string;
  margin?: CSSProperties['margin'];
  alignItems?: CSSProperties['alignItems'];
}

const AddProductModalFormGroup = (props: Props) => {
  const { text, children, hintText, margin, alignItems } = props;

  return (
    <FormGroup $gridTemplateColumns="40% 1fr" $alignItems={alignItems} $margin={margin}>
      <Label $gap={hintText ? '4px' : undefined}>
        <SpanWithEllipsis text={text} />

        {hintText && <Hint text={hintText} />}
      </Label>

      {children}
    </FormGroup>
  );
};

export { AddProductModalFormGroup };
