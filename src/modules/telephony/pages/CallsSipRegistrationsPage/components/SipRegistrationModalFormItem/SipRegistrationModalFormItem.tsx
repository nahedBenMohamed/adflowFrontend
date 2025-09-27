import { FormGroup, Hint, Label } from '@/shared';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
  hint?: string;
}

const SipRegistrationModalFormItem = (props: Props) => {
  const { label, children, hint } = props;

  return (
    <FormGroup
      $gap="16px"
      $noEllipsis
      $alignItems="flex-start"
      $gridTemplateColumns="calc(40% - 4px) calc(60% - 4px)"
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

export { SipRegistrationModalFormItem };
