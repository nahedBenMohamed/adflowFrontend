import { FormGroup, Hint, Label } from '@/shared';
import type { CSSProperties, ReactNode } from 'react';

interface Props {
  label: string;
  alignItems?: CSSProperties['alignItems'];
  children: ReactNode;
  hint?: string;
}

export const INTEGRATION_FORM_GROUP_GRID = 'calc(40% - 4px) calc(60% - 4px)';

const IntegrationFormGroup = (props: Props) => {
  const { label, alignItems, children, hint } = props;

  return (
    <FormGroup
      $gap="8px"
      $noEllipsis
      $alignItems={alignItems ?? 'flex-start'}
      $gridTemplateColumns={INTEGRATION_FORM_GROUP_GRID}
    >
      <Label $noEllipsis $color="var(--button-text-graphite-primary-text)">
        <p>
          <span>{label}</span>

          {hint && (
            <>
              {' '}
              <Hint text={hint} as="span" />
            </>
          )}
        </p>
      </Label>

      {children}
    </FormGroup>
  );
};

export { IntegrationFormGroup };
