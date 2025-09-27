import { FormGroup, Hint, Label, SpanWithEllipsis } from '@/shared';
import type { CSSProperties, ReactNode } from 'react';

interface Props {
  text: string;
  children: ReactNode;
  hint?: string;
  gridRow?: CSSProperties['gridRow'];
  gridTemplateColumns?: CSSProperties['gridTemplateColumns'];
}

const GeneralSettingsPageFormGroup = (props: Props) => {
  const { text, children, hint, gridRow, gridTemplateColumns } = props;

  return (
    <FormGroup
      $gap="16px"
      $margin={0}
      $gridRow={gridRow}
      $position="relative"
      $gridTemplateColumns={gridTemplateColumns ?? '40% calc(60% - 16px)'}
    >
      <Label $gap="8px" $color="var(--button-text-graphite-primary-text)">
        <SpanWithEllipsis text={text} />

        {hint && <Hint text={hint} />}
      </Label>

      {children}
    </FormGroup>
  );
};

export { GeneralSettingsPageFormGroup };
